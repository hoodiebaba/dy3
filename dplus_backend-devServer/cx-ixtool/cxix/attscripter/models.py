from django.db import models
from django.contrib.auth.models import User


class ssbFrequency(models.Model):
    mname = models.CharField(max_length=50, blank=False)
    arfcndl = models.CharField(max_length=20, blank=False)
    bschannelbwdl = models.CharField(max_length=20, blank=False)
    ssbfrequency = models.CharField(max_length=20, blank=False)
    ssboffset = models.CharField(max_length=20, blank=False)
    ssbduration = models.CharField(max_length=20, blank=False)
    ssbperiodicity = models.CharField(max_length=20, blank=False)
    ssbsubcarrierspacing = models.CharField(max_length=20, blank=False)
    arfcnul = models.CharField(max_length=20, blank=False)
    bschannelbwul = models.CharField(max_length=20, blank=False)
    band = models.CharField(max_length=20, blank=False)

    def __str__(self): return F'{self.mname}  {self.arfcndl}  {self.bschannelbwdl}  {self.ssbfrequency}  {self.ssboffset}  {self.ssbduration}  ' \
                              F'{self.ssbperiodicity}  {self.ssbsubcarrierspacing}  {self.arfcnul}  {self.bschannelbwul}  {self.band}'

    class Meta:
        db_table = 'att_ssbfrequency'
        unique_together = ('mname', 'arfcndl', 'bschannelbwdl')
        verbose_name = 'ssbFrequency'


class MMEPool(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self): return F'{self.name}'

    class Meta:
        db_table = 'att_mmepool'
        unique_together = ('name',)
        verbose_name = 'MMEPool'


class TermPointToMme(models.Model):
    mmepool = models.ForeignKey(MMEPool, on_delete=models.CASCADE)
    mmeName = models.CharField(max_length=50, blank=False)
    termPointToMmeId = models.CharField(max_length=50, blank=False)
    ipAddress1 = models.CharField(max_length=50, blank=False)
    ipAddress2 = models.CharField(max_length=50, blank=False)
    ipv6Address1 = models.CharField(max_length=50, blank=False)
    ipv6Address2 = models.CharField(max_length=50, blank=False)
    mmeSupportLegacyLte = models.CharField(max_length=50, blank=False)
    mmeSupportNbIoT = models.CharField(max_length=50, blank=False)

    def __str__(self): return F'{self.mmepool.__str__()}  {self.mmeName}  {self.termPointToMmeId}  {self.ipAddress1}  {self.ipAddress2}  ' \
                              F'{self.ipv6Address1}  {self.ipv6Address2}  {self.mmeSupportLegacyLte}  {self.mmeSupportNbIoT}'

    class Meta:
        db_table = 'att_termpointmme'
        unique_together = ('mmepool', 'mmeName')
        verbose_name = 'TermPointToMMe'


class AMFPool(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self): return F'{self.name}'

    class Meta:
        db_table = 'att_amfpool'
        unique_together = ('name',)
        verbose_name = 'AMFPool'


class TermPointToAmf(models.Model):
    amfpool = models.ForeignKey(AMFPool, on_delete=models.CASCADE)
    amfName = models.CharField(max_length=50, blank=False)
    defaultAmf = models.CharField(max_length=50, blank=False)
    ipv4Address1 = models.CharField(max_length=50, blank=False)
    ipv4Address2 = models.CharField(max_length=50, blank=False)
    ipv6Address1 = models.CharField(max_length=50, blank=False)
    ipv6Address2 = models.CharField(max_length=50, blank=False)
    termPointToAmfId = models.CharField(max_length=50, blank=False)

    def __str__(self): return F'{self.amfpool.__str__()}  {self.amfName}  {self.defaultAmf}  {self.ipv4Address1}  {self.ipv4Address2}  ' \
                              F'{self.ipv6Address1}  {self.ipv6Address2}  {self.termPointToAmfId}'

    class Meta:
        db_table = 'att_termpointamf'
        unique_together = ('amfpool', 'termPointToAmfId')
        verbose_name = 'TermPointToAmf'


class Software(models.Model):
    swname = models.CharField(max_length=50, blank=False)
    nodeIdentBB = models.CharField(max_length=100, blank=False)
    nodeTypeBB = models.CharField(max_length=100, blank=False)
    UpPacBB = models.CharField(max_length=100, blank=False)

    def __str__(self): return F'{self.swname}  {self.nodeIdentBB}  {self.nodeTypeBB}  {self.UpPacBB}'

    class Meta:
        db_table = 'att_software'
        unique_together = ('swname',)
        verbose_name = 'Software'


class Client(models.Model):
    cname = models.CharField(max_length=50, blank=False)
    mname = models.CharField(max_length=50, blank=False)
    enm = models.CharField(max_length=50, blank=False)
    software = models.ForeignKey(Software, on_delete=models.CASCADE)
    mmepool = models.ForeignKey(MMEPool, on_delete=models.CASCADE)
    amfpool = models.ForeignKey(AMFPool, on_delete=models.CASCADE)
    NTPServer1 = models.CharField(max_length=50, blank=False)
    NTPServer2 = models.CharField(max_length=50, blank=False)
    timeZone = models.CharField(max_length=50, blank=False)
    dnPrefix = models.CharField(max_length=100, blank=False)
    SubNetwork = models.CharField(max_length=100, blank=False)
    UserName = models.CharField(max_length=50, blank=False)
    Userpass = models.CharField(max_length=50, blank=False)
    sUserName = models.CharField(max_length=50, blank=False)
    sUserpass = models.CharField(max_length=50, blank=False)
    creator = models.CharField(max_length=50, blank=False)
    TnPort = models.CharField(max_length=50, blank=False)
    gnbidlength = models.CharField(max_length=50, blank=False)
    PlmnList = models.CharField(max_length=550, blank=False, null=False)
    addPlmnList = models.CharField(max_length=550, blank=False)

    def __str__(self): return F'{self.software.swname}  {self.cname}  {self.mname}  {self.enm}  {self.mmepool}  {self.amfpool}'

    class Meta:
        db_table = 'att_client'
        unique_together = ('cname', 'mname', 'enm', 'software')
        verbose_name = 'Client'


class MoRelation(models.Model):
    software = models.ForeignKey(Software, on_delete=models.CASCADE)
    parent = models.CharField(max_length=100)
    child = models.CharField(max_length=100)
    tag = models.CharField(max_length=100)

    def __str__(self): return F'{self.software.swname}  {self.parent}  {self.child}  {self.tag}'

    class Meta:
        db_table = 'att_mo_relation'
        unique_together = ('parent', 'child', 'software', 'tag')
        verbose_name = 'MoRelation'


class MoAttribute(models.Model):
    software = models.ForeignKey(Software, on_delete=models.CASCADE)
    moc = models.CharField(max_length=100)
    attribute = models.CharField(max_length=100)

    def __str__(self): return F'{self.software.swname}  {self.moc}  {self.attribute}'

    class Meta:
        db_table = 'att_mo_attr'
        unique_together = ('moc', 'software')
        verbose_name = 'MoAttribute'


class MoName(models.Model):
    software = models.ForeignKey(Software, on_delete=models.CASCADE)
    moc = models.CharField(max_length=100, blank=False, null=False)
    moid = models.CharField(max_length=100, null=False, blank=True)
    motype = models.CharField(max_length=20, null=False, blank=False)

    def __str__(self): return F'{self.software.swname}  {self.moc}  {self.moid}  {self.motype}'


    class Meta:
        db_table = 'att_mo_name'
        unique_together = ('software', 'moc', 'moid', 'motype')
        verbose_name = 'MoName'


class MoDetail(models.Model):
    mo = models.ForeignKey(MoName, on_delete=models.CASCADE)
    parameter = models.CharField(max_length=100, blank=False, null=False)
    value = models.CharField(max_length=11000, null=False, default='')
    flag = models.BooleanField(default=True)

    def __str__(self): return F'{self.mo.__str__()}  {self.parameter}  {self.value}  {self.flag}'

    class Meta:
        db_table = 'att_mo_modetail'
        unique_together = ('mo', 'parameter')
        verbose_name = 'MoDetail'


class ATTScriptJob(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='att_script_job')
    sites = models.CharField(max_length=500, blank=True, null=True, default='')
    status = models.CharField(max_length=100, blank=True, null=True, default='Queued')
    script = models.CharField(max_length=100, blank=True, null=True, default='')
    create_dt = models.DateTimeField(auto_now_add=True)
    update_dt = models.DateTimeField(auto_now=True)

    def __str__(self): return F'{self.client.__str__()}  {self.sites}  {self.status}'

    def natural_key(self):
        return (self.client.natural_key(), self.user.username)
    
    class Meta:
        db_table = 'att_script_job'
        ordering = ('-update_dt',)
        verbose_name = 'ATTScriptJob'
