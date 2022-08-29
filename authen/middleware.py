import codecs
import re
from django.conf import settings
from django.shortcuts import render
from django.urls import resolve
from netaddr import IPAddress, IPSet
from ldap3 import Server, Connection, SUBTREE


def get_info_ad_from_settings(name):
    return getattr(settings, name)


def GetDataFromAD(request):
    AD_SERVER = get_info_ad_from_settings('AD_SERV')
    AD_USER = get_info_ad_from_settings('AD_US')
    AD_PASSWORD = get_info_ad_from_settings('AD_PASS')
    AD_SEARCH_TREE = get_info_ad_from_settings('AD_SEARCH')
    server = Server(AD_SERVER)
    conn = Connection(server, user=AD_USER, password=AD_PASSWORD)
    conn.bind()
    user = request.user.username
    conn.search(AD_SEARCH_TREE, '(sAMAccountName='+user+')', SUBTREE, attributes=['DisplayName','department','mail', 'telephoneNumber'])
    user = conn.entries
    return [user[0].displayName, user[0].department, user[0].mail, user[0].telephoneNumber]


def GetUserDepAD(request):
    AD_SERVER = get_info_ad_from_settings('AD_SERV')
    AD_USER = get_info_ad_from_settings('AD_US')
    AD_PASSWORD = get_info_ad_from_settings('AD_PASS')
    AD_SEARCH_TREE = get_info_ad_from_settings('AD_SEARCH')
    server = Server(AD_SERVER)
    conn = Connection(server, user=AD_USER, password=AD_PASSWORD)
    conn.bind()
    user = request.user.username
    conn.search(AD_SEARCH_TREE, '(sAMAccountName=' + user + ')', SUBTREE,
                attributes=['department', 'title', 'manager'])
    data = conn.entries
    t = codecs.decode(str(data[0].title), 'unicode-escape')
    titles = ['Руководитель', 'руководитель', 'Начальник', 'начальник', 'Заместитель', 'заместитель', 'Главный бухгалтер']
    flag = False
    for title in titles:
        if title in t:
            flag = True
    if flag is False:
        titles = ['Заведующий', 'заведующий']
        for title in titles:
            if title in t:
                flag = True
        if flag is True:
            manager = codecs.decode(str(data[0].manager), 'unicode-escape')
            conn.search(AD_SEARCH_TREE, '(distinguishedName=' + manager + ')', SUBTREE,
                        attributes=['department', 'title'])
            data = conn.entries
        else:
            manager = codecs.decode(str(data[0].manager), 'unicode-escape')
            conn.search(AD_SEARCH_TREE, '(distinguishedName=' + manager + ')', SUBTREE,
                        attributes=['manager', 'title', 'department'])
            data = conn.entries
            titles = ['Начальник', 'начальник', 'Главный бухгалтер']
            check_t = codecs.decode(str(data[0].title), 'unicode-escape')
            Flag = False
            for tit in titles:
                if tit in check_t:
                    Flag = True
            if Flag is False:
                data = conn.entries
                m = codecs.decode(str(data[0].manager), 'unicode-escape')
                conn.search(AD_SEARCH_TREE, '(distinguishedName=' + m + ')', SUBTREE,
                            attributes=['department'])
                data = conn.entries
    d = codecs.decode(str(data[0].department), 'unicode-escape')
    AD_SEARCH_DEP = 'ou=Groups,ou=CMN,ou=COKO,dc=coko38,dc=ru'
    conn.search(AD_SEARCH_DEP, '(info=' + d + ')', SUBTREE,
                attributes=['displayName'])
    data = conn.entries
    return codecs.decode(str(data[0].displayName),  'unicode-escape')


def GetDepsFromAD():
    AD_SERVER = get_info_ad_from_settings('AD_SERV')
    AD_USER = get_info_ad_from_settings('AD_US')
    AD_PASSWORD = get_info_ad_from_settings('AD_PASS')
    AD_SEARCH_TREE = 'ou=Groups,ou=CMN,ou=COKO,dc=coko38,dc=ru'
    server = Server(AD_SERVER)
    conn = Connection(server, user=AD_USER, password=AD_PASSWORD)
    conn.bind()
    conn.search(AD_SEARCH_TREE, '(cn=centre_*)', SUBTREE, attributes=['DisplayName'])
    deps = conn.entries
    list = []
    for dep in deps:
        dn = dep.displayName
        if len(codecs.decode(str(dn), 'unicode-escape')) > 2:
            list.append(codecs.decode(str(dn), 'unicode-escape'))
    list.sort(reverse=True)
    return list


def GetDepsWithManagerFromAD():
    AD_SERVER = get_info_ad_from_settings('AD_SERV')
    AD_USER = get_info_ad_from_settings('AD_US')
    AD_PASSWORD = get_info_ad_from_settings('AD_PASS')
    AD_SEARCH_TREE = 'ou=Groups,ou=CMN,ou=COKO,dc=coko38,dc=ru'
    server = Server(AD_SERVER)
    conn = Connection(server, user=AD_USER, password=AD_PASSWORD)
    conn.bind()
    conn.search(AD_SEARCH_TREE, '(cn=centre_*)', SUBTREE, attributes=['displayName', 'managedBy'])
    deps = conn.entries
    voc = {}
    for dep in deps:
        dn = dep.displayName
        mngby = codecs.decode(str(dep.managedBy), 'unicode-escape')
        manager = mngby[3:mngby.find(',')]
        if len(codecs.decode(str(dn), 'unicode-escape')) > 2:
            voc[codecs.decode(str(dn), 'unicode-escape')] = manager
    return voc


def get_networks_from_settings(name):
    return IPSet(getattr(settings, name, []))


def check_network(request):
    user_ip = request.META['HTTP_X_FORWARDED_FOR']
    if IPAddress(user_ip.rpartition(':')[0]) in get_networks_from_settings('ALLOWED_NETWORKS'):
        return True
    else:
        return False


class AdminWhitelistMiddleware:
    """Limits login to specific IP's in Django 3"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        current_url = resolve(request.path_info)
        is_admin_app = (current_url.app_name == 'admin')
        if is_admin_app and check_network(request) is False:
            return render(request, 'error.html',
                          {'error': 'Вход разрешен только из внутренней сети организации'})
        return self.get_response(request)