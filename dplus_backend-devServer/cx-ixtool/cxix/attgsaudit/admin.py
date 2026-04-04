from django.contrib import admin
from .models import LTEBandBWLayer, LTECAPair, UMTSBand, AuditJob, LTEearfcnBandBWLayer, NRBand

admin.site.register(LTEBandBWLayer)
admin.site.register(LTECAPair)
admin.site.register(UMTSBand)
admin.site.register(AuditJob)
admin.site.register(LTEearfcnBandBWLayer)
admin.site.register(NRBand)
