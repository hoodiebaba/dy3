import os
from datetime import datetime
from datetime import timedelta
import pytz

time_zone="Asia/Kolkata"
# time_zone="America/Mexico_City"
# time_zone="America/North_Dakota/Center"
def unique_timestamp():
    now = datetime.now()
    return str(datetime.timestamp(now)).split(".")[0]+str(datetime.timestamp(now)).split(".")[1]

def u_timestamp(addtime=None):
    now = datetime.now()
    if(addtime):
        now=now+addtime
    return int(str(datetime.timestamp(now)).split(".")[0])

def datetimeObj():
    now = datetime.now()
    return now

def timestamp():
    return '{:%m/%d/%Y-%H:%M}'.format(datetime.now())


def mdy_timestamp():
    IST = pytz.timezone(time_zone)
    
    return '{:%m/%d/%Y %H:%M}'.format(datetime.now(IST))


def ymd_timestamp():
    IST = pytz.timezone(time_zone)
    
    return '{:%Y/%m/%d %H:%M}'.format(datetime.now(IST))


def fileame_mdy_timestamp():
    IST = pytz.timezone(time_zone)
    
    return '{:%m%d%Y%H%M}'.format(datetime.now(IST))


def date_mdy_timestamp():
    IST = pytz.timezone(time_zone)
    
    return '{:%m/%d/%Y}'.format(datetime.now(IST))

def date_mdy_CST():
    IST = pytz.timezone(time_zone)
    
    return '{:%m/%d/%Y}'.format(datetime.now(CST))

def mdy_timestampwof(merge):
    IST = pytz.timezone(time_zone)
    
    return '{:%m_%d_%Y_%H_%M}'.format(datetime.now(IST))


def dash_mdy_timestamp(date1):
    IST = pytz.timezone(time_zone)
    startdate=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    
    return '{:%Y-%d-m%}'.format(datetime.now(startdate))

def curr_add_form(form='%m/%d/%Y %H:%M',minute=0,second=0,hour=0,day=0,month=0,year=0):

    IST = pytz.timezone(time_zone)
    final=datetime.now(IST)+timedelta(days=day, hours=hour, minutes=minute, seconds=second)
    print(final,"'{:'+form+'}''{:'+form+'}'")
    formatted_date = final.strftime(form)
    return formatted_date


def mdy_timestamp_week():
    IST = pytz.timezone(time_zone)
    
    return '{:%U}'.format(datetime.now(IST))


def strtomdy_timestamp(date):
    IST = pytz.timezone(time_zone)
    
    return '{:%m/%d/%Y %H:%M}'.format(datetime.now(IST))


def agebtwtwodate_timestamp(date1,date2,returntype):
    IST = pytz.timezone(time_zone)
    startdate=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    enddate=datetime.strptime(date2, '%m/%d/%Y %H:%M')

    cmopared=enddate-startdate
    cmopared.total_seconds()

    return cmopared.total_seconds()
    
    return '{:%m/%d/%Y %H:%M:%S}'.format(datetime.now(IST))





def agetwodate_timestamp(date1,date2,returntype):
    IST = pytz.timezone(time_zone)
    startdate=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    enddate=datetime.strptime(date2, '%m/%d/%Y %H:%M')
    print(enddate,"enddate",startdate,"startdate")
    cmopared=enddate-startdate
    # cmopared.total_seconds()
    # print(dasdsa)
    return cmopared
    
    return '{:%m/%d/%Y %H:%M:%S}'.format(datetime.now(IST))


def agetwodate_w_timestamp(date1,date2,returntype):
    IST = pytz.timezone(time_zone)
    startdate=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    enddate=datetime.strptime(date2, '%m/%d/%Y %H:%M')
    print(enddate,"enddate",startdate,"startdate")
    cmopared=enddate-startdate
    print(cmopared)
    days, seconds = cmopared.days, cmopared.seconds
    hours = days * 24 + seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    # cmopared.total_seconds()

    print("0"+str(hours)+":00" if len(str(hours))==1 else str(hours)+":00",minutes)
    return "0"+str(hours)+":00" if len(str(hours))==1 else str(hours)+":00"


def difference_of_two(date1,date2):
    IST = pytz.timezone(time_zone)
    startdate=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    enddate=date2.split(":")[0]
    print(enddate,"enddate",startdate,"startdate")
    cmopared=startdate+timedelta(hours=int(enddate))
    # cmopared.total_seconds()
    
    print(cmopared,"cmopared")

    
    return '{:%m/%d/%Y %H:%M}'.format(cmopared)


def difference_of_twousinghour(date1,date2):
    IST = pytz.timezone(time_zone)
    startdate=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    cmopared=startdate+timedelta(hours=int(date2))
    # cmopared.total_seconds()
    
    print(cmopared,"cmopared")

    
    return '{:%m/%d/%Y %H:%M}'.format(cmopared)



def mobiledateFormat(type,date):
    if(type=="Full"):
        startdate=datetime.strptime(date, '%Y/%m/%d %H:%M:%S')
        return '{:%m/%d/%Y %H:%M}'.format(startdate) 
    
    if(type=="custom"):
        startdate=datetime.strptime(date, '%H:%M')
        return '{:%H:%M}'.format(startdate) 
    





def add_day_in_date(dayaddOn):
    IST = pytz.timezone(time_zone)

    nextDate=datetime.now(IST)+timedelta(days=dayaddOn)
    
    return '{:%m/%d/%Y %H:%M}'.format(nextDate)


def subtract_day_in_date(dayaddOn):
    IST = pytz.timezone(time_zone)

    nextDate=datetime.now(IST)-timedelta(days=dayaddOn)
    
    return '{:%m/%d/%Y %H:%M}'.format(nextDate)


def add_hour_in_date(date1,hoursaddOn):
    IST = pytz.timezone(time_zone)
    initial_date=datetime.strptime(date1, '%m/%d/%Y %H:%M')

    nextDate=initial_date+timedelta(hours=hoursaddOn)
    
    return '{:%m/%d/%Y %H:%M}'.format(nextDate)


def add_minute_in_date(date1,minuteaddOn):
    IST = pytz.timezone(time_zone)
    initial_date=datetime.strptime(date1, '%m/%d/%Y %H:%M')

    nextDate=initial_date+timedelta(minutes=minuteaddOn)
    
    return '{:%m/%d/%Y %H:%M}'.format(nextDate)



def ymdtimezone(days=None):
    
    IST = pytz.timezone(time_zone)
    
    curr_date=datetime.now(IST)
    if(days):
        curr_date = curr_date-timedelta(days=days)
    
    return '{:%Y-%m-%d}'.format(curr_date)

def add_minute_sec_in_date(date1,minuteaddOn,secondaddOn):
    IST = pytz.timezone(time_zone)
    initial_date=datetime.strptime(date1, '%m/%d/%Y %H:%M')

    nextDate=initial_date+timedelta(minutes=minuteaddOn,seconds=secondaddOn)
    
    return '{:%m/%d/%Y %H:%M}'.format(nextDate)


def sub_hour_in_date(date1,hoursaddOn):
    IST = pytz.timezone(time_zone)
    initial_date=datetime.strptime(date1, '%m/%d/%Y %H:%M')

    nextDate=initial_date-timedelta(hours=hoursaddOn)
    
    return '{:%m/%d/%Y %H:%M}'.format(nextDate)

def sub__in_date(date1,hoursaddOn):
    IST = pytz.timezone(time_zone)
    initial_date=datetime.strptime(date1, '%m/%d/%Y %H:%M')

    nextDate=initial_date-timedelta(hours=hoursaddOn)
    
    return '{:%m/%d/%Y %H:%M}'.format(nextDate)


def time_from_date(date1):
    IST = pytz.timezone(time_zone)
    initial_date=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    
    return '{:%H:%M}'.format(initial_date)


def time_from_date_no_ss(date1):
    IST = pytz.timezone(time_zone)
    initial_date=datetime.strptime(date1, '%m/%d/%Y %H:%M')
    
    return '{:%H:%M}'.format(initial_date)



def stringdatetodate(date1,form='%m/%d/%Y %H:%M'):
    UTC = pytz.timezone('UTC')
    initial_date=datetime.strptime(date1, form)
    
    print(initial_date.year,initial_date.month,initial_date.day,initial_date,"initial_date")
    return initial_date







