from base import *


def argstostr(argu,tw=""):
    st=[]
    def_start=int(os.environ.get("DEFAULT_PAGINATION_START"))
    def_end=int(os.environ.get("DEFAULT_PAGINATION_END"))
    print(argu,"arguargu")
    for i in argu:
        if(i=="start"):
            def_start=int(argu.get(i))
        elif(i=="end"):
            def_end=int(argu.get(i))
        else:
            st.append(f"{tw}.{i}='{argu.get(i)}'")

    return {
        "que":" AND ".join(st),
        "def_start":def_start,
        "def_end":def_end
    }
