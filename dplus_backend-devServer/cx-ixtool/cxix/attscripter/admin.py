from django.contrib import admin
from .models import Software, Client, ATTScriptJob, MoRelation, MoAttribute, ssbFrequency
from .models import MMEPool, TermPointToMme, AMFPool, TermPointToAmf
from .models import MoName, MoDetail


class ClientSWAdmin(admin.ModelAdmin):
    list_display = ('cname', 'mname', 'swrel')


class TermPointToMmeAdmin(admin.ModelAdmin):
    list_display = ('mmepool', 'mmeName', 'termPointToMmeId', 'mmeSupportNbIoT', 'ipAddress1', 'ipAddress2', 'ipv6Address1', 'ipv6Address2')


class TermPointToAmfAdmin(admin.ModelAdmin):
    list_display = ('amfpool', 'amfName', 'termPointToAmfId', 'ipv4Address1', 'ipv4Address2', 'ipv6Address1', 'ipv6Address2', 'defaultAmf')


admin.site.register(Software)
admin.site.register(Client)
admin.site.register(ATTScriptJob)
admin.site.register(MoRelation)
admin.site.register(MoAttribute)
admin.site.register(ssbFrequency)

admin.site.register(MMEPool)
admin.site.register(AMFPool)
admin.site.register(TermPointToMme, TermPointToMmeAdmin)
admin.site.register(TermPointToAmf, TermPointToAmfAdmin)

admin.site.register(MoName)
admin.site.register(MoDetail)

