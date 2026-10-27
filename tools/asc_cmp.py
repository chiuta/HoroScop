"""Referință independentă pentru ascendent (HoroScop). Cerințe: pip install pyerfa skyfield numpy.
Intrare: asc_horoscop.json (tools/precizie-ascendent-esantioane.mjs). Usage: python3 tools/asc_cmp.py horoscop
Referința: timp sideral aparent + oblicitate adevărată (ERFA, IAU 2006/2000A) și definiția geometrică a ascendentului rezolvată numeric (nu formula închisă).
"""
import json,sys,os,math,numpy as np
import erfa
from skyfield.api import load
def brentq(f,a,b,xtol=1e-11):
    fa=f(a); fb=f(b)
    for _ in range(100):
        m=(a+b)/2; fm=f(m)
        if fa*fm<=0: b,fb=m,fm
        else: a,fa=m,fm
        if b-a<xtol: break
    return (a+b)/2
ts=load.timescale()
mode=sys.argv[1]; rows=json.load(open(f'asc_{mode}.json'))
def w180(x): return (x+180)%360-180
def sd(a,b): return abs(w180(a-b))*60
def refstate(jd):
    t=ts.ut1_jd(jd); tt=float(t.tt)
    gast=math.degrees(erfa.gst06a(jd,0.0,tt,0.0))   # aparent (IAU 2006/2000A)
    tt2=tt-2400000.5
    dpsi,deps=erfa.nut06a(2400000.5,tt2); eps=erfa.obl06(2400000.5,tt2)+deps
    return gast%360, eps
def radec(lam,eps):
    l=math.radians(lam); a=math.degrees(math.atan2(math.cos(eps)*math.sin(l),math.cos(l)))%360
    d=math.degrees(math.asin(math.sin(eps)*math.sin(l))); return a,d
def Hf(lam,ramc,eps): return w180(ramc-radec(lam,eps)[0])
def alt0(lam,ramc,eps,lat):   # sin(alt) la punctul eclipticii
    a,d=radec(lam,eps); H=math.radians(ramc-a); ph=math.radians(lat); dd=math.radians(d)
    return math.sin(ph)*math.sin(dd)+math.cos(ph)*math.cos(dd)*math.cos(H)
def roots(f,lo,hi,n):
    xs=np.linspace(lo,hi,n); ys=[f(x) for x in xs]; out=[]
    for i in range(n-1):
        if ys[i]==0: out.append(xs[i]); continue
        if ys[i]*ys[i+1]<0 and abs(ys[i])<60 and abs(ys[i+1])<60:
            out.append(brentq(f,xs[i],xs[i+1],xtol=1e-11))
    return out
def ref_asc(ramc,eps,lat):
    rs=roots(lambda l:alt0(l,ramc,eps,lat),0,360,3601)
    # răsărit: punctul din est (H în (-180,0))
    e=[r%360 for r in rs if Hf(r,ramc,eps)<0]
    return e[0] if e else None
def ref_mc(ramc,eps):
    rs=roots(lambda l:Hf(l,ramc,eps),0,360,3601)
    return [r%360 for r in rs if abs(Hf(r+0.001,ramc,eps))<1][0] if rs else None
def sda(lam,eps,lat):
    a,d=radec(lam,eps); x=-math.tan(math.radians(lat))*math.tan(math.radians(d)); 
    if abs(x)>=1: return None
    return math.degrees(math.acos(x))
def ref_cusp(kind,ramc,eps,lat,asc,mc):
    def g(l):
        S=sda(l,eps,lat)
        if S is None: return 999
        N=180-S
        tgt={'c11':-S/3,'c12':-2*S/3,'c2':-(S+N/3),'c3':-(S+2*N/3)}[kind]
        return w180(Hf(l,ramc,eps)-tgt)
    lo,hi=(mc,asc) if kind in('c11','c12') else (asc,(mc+180)%360)
    span=(hi-lo)%360
    xs=np.linspace(0,span,1201)
    ys=[g((lo+x)%360) for x in xs]
    for i in range(1200):
        if abs(ys[i])<900 and abs(ys[i+1])<900 and ys[i]*ys[i+1]<0 and abs(ys[i])<60:
            f=lambda x:g((lo+x)%360)
            return (lo+brentq(f,xs[i],xs[i+1],xtol=1e-11))%360
    return None
def house(c,t):
    for i in range(12):
        if w180(0)==0 and ((t-c[i])%360)<((c[(i+1)%12]-c[i])%360): return i+1
    return 12
REF=[]
E={k:[] for k in ('asc','mc','c11','c12','c2','c3')}; Eh={k:[] for k in ('asc','mc','c11','c12','c2','c3')}
nvalid=0; hmis=0; hn=0; vmis=0; emis=0; wmis=0; n=0
byband={'<=45':[], '45-60':[], '60-65':[]}; bandc={'<=45':[], '45-60':[], '60-65':[]}
for r in rows:
    gast,eps=refstate(r['jd']); ramc=(gast+r['lon'])%360; lat=r['lat']
    a=ref_asc(ramc,eps,lat)
    if a is None: continue
    n+=1
    ea=sd(r['asc'],a); E['asc'].append(ea)
    REF.append({'jd':r['jd'],'lon':r['lon'],'lat':lat,'tgt':r['tgt'],'asc':a})
    if mode=='horoscop': 
        band='<=45' if abs(lat)<=45 else ('45-60' if abs(lat)<=60 else '60-65'); byband[band].append(ea); continue
    m=ref_mc(ramc,eps); E['mc'].append(sd(r['mc'],m)); REF[-1]['mc']=m
    band='<=45' if abs(lat)<=45 else ('45-60' if abs(lat)<=60 else '60-65'); byband[band].append(ea)
    rc={k:ref_cusp(k,ramc,eps,lat,a,m) for k in ('c11','c12','c2','c3')}
    refvalid=all(v is not None for v in rc.values()); REF[-1]['c']=[rc['c11'],rc['c12'],rc['c2'],rc['c3']] if refvalid else None
    if refvalid != r['valid']: vmis+=1
    # case egale și semne întregi față de ascendentul de referință
    eh=int(((r['tgt']-a)%360)//30)+1; emis+= (eh!=r['he'])
    wh=((int((r['tgt']%360)//30)-int(a//30))%12)+1; wmis+=(wh!=r['hw'])
    if refvalid and r['valid']:
        nvalid+=1
        for k,i in (('c11',10),('c12',11),('c2',1),('c3',2)):
            e=sd(r['c'][i],rc[k]); E[k].append(e); bandc[band].append(e)
        cref=[0]*12; cref[9]=m; cref[0]=a; cref[10]=rc['c11']; cref[11]=rc['c12']; cref[1]=rc['c2']; cref[2]=rc['c3']
        cref[3]=(m+180)%360; cref[6]=(a+180)%360; cref[4]=(cref[10]+180)%360; cref[5]=(cref[11]+180)%360; cref[7]=(cref[1]+180)%360; cref[8]=(cref[2]+180)%360
        hn+=1; hmis+=(house(cref,r['tgt'])!=r['hp'])
def st(v): v=np.array(v); return [round(float(v.mean()),3),round(float(np.percentile(v,95)),3),round(float(v.max()),3)]
res={'n':n}
for k,v in E.items():
    if v: res[k]=st(v); print(k.ljust(4),'mean/p95/max arcmin',res[k],'n',len(v))
for b,v in byband.items():
    if v: print('asc lat',b,st(v),len(v)); res['asc_'+b]=st(v)
for b,v in bandc.items():
    if v: print('placidus cusps lat',b,st(v),len(v)); res['pl_'+b]=st(v)
if mode!='horoscop':
    print('Placidus valid-flag mismatches',vmis,'of',n,'; valid',nvalid)
    print('house mismatch Placidus',hmis,'/',hn,'equal',emis,'/',n,'whole',wmis,'/',n)
    res.update(vmis=vmis,hmis=hmis,hn=hn,emis=emis,wmis=wmis)
json.dump(res,open(f'asc_{mode}_res.json','w'))
json.dump(REF,open(f'asc_{mode}_ref.json','w'),separators=(',',':'))
