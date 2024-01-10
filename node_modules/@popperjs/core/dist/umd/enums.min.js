/**
 * @popperjs/core v2.11.6 - MIT License
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Popper={})}(this,(function(e){"use strict";var t="bottom",r="right",o="left",n="auto",a=["top",t,r,o],i="start",f="end",p=a.reduce((function(e,t){return e.concat([t+"-"+i,t+"-"+f])}),[]),c=[].concat(a,[n]).reduce((function(e,t){return e.concat([t,t+"-"+i,t+"-"+f])}),[]),d="beforeRead",s="read",u="afterRead",l="beforeMain",b="main",m="afterMain",P="beforeWrite",g="write",h="afterWrite",v=[d,s,u,l,b,m,P,g,h];e.afterMain=m,e.afterRead=u,e.afterWrite=h,e.auto=n,e.basePlacements=a,e.beforeMain=l,e.beforeRead=d,e.beforeWrite=P,e.bottom=t,e.clippingParents="clippingParents",e.end=f,e.left=o,e.main=b,e.modifierPhases=v,e.placements=c,e.popper="popper",e.read=s,e.reference="reference",e.right=r,e.start=i,e.top="top",e.variationPlacements=p,e.viewport="viewport",e.write=g,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=enums.min.js.map
