// Rectangular Hungarian assignment: globally minimizes total cost, one card per tile.
export function assign(cost,n,m){
 if(n>m)throw Error('Unique assignment requires at least one card per tile');
 const u=new Float64Array(n+1),v=new Float64Array(m+1),p=new Int32Array(m+1),way=new Int32Array(m+1);
 for(let i=1;i<=n;i++){p[0]=i;let j0=0;const min=new Float64Array(m+1).fill(Infinity),used=new Uint8Array(m+1);
 do{used[j0]=1;const i0=p[j0];let delta=Infinity,j1=0;for(let j=1;j<=m;j++)if(!used[j]){const cur=cost[(i0-1)*m+j-1]-u[i0]-v[j];if(cur<min[j]){min[j]=cur;way[j]=j0}if(min[j]<delta){delta=min[j];j1=j}}
 for(let j=0;j<=m;j++)if(used[j]){u[p[j]]+=delta;v[j]-=delta}else min[j]-=delta;j0=j1;
 }while(p[j0]!==0);
 do{const j1=way[j0];p[j0]=p[j1];j0=j1}while(j0!==0)}
 const out=new Int32Array(n);for(let j=1;j<=m;j++)if(p[j])out[p[j]-1]=j-1;return out;
}
export function distance(a,b,method,weight){let mean=0,spatial=0;for(let k=0;k<3;k++)mean+=(a.mean[k]-b.mean[k])**2;if(method==='value')return ((a.luminance-b.luminance)/255)**2;
 if(method==='mean')return mean/(3*255**2);for(let k=0;k<24;k++)spatial+=(a.grid[k]-b.grid[k])**2;return (1-weight)*mean/(3*255**2)+weight*spatial/(24*255**2)}
