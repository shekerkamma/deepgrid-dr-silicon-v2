'use client';

import {Shell, useNav} from '../shell';
import {PRE_SILICON} from '../copy';
import {ArrowRight,ArrowUpRight,Check} from 'lucide-react';
import {DataTable,ExplainedGrid,Sec,SectionHead} from '../detail';
import {familyCompare, sovereignSkuHorizon} from '../detail-content';
import {parts} from '../content';
import Architecture from '../architecture';
import Related from '../related';
import {url} from '../routes';

// Use the source diagrams, with a full-size inspection link, rather than film title cards.
const partPosters: Record<string, string> = {
  lite: '/diagrams/dg32-lite-architecture.svg',
  '2dom': '/diagrams/dg32-2dom-architecture.svg',
};

export default function Page() {
  const {navigate, go} = useNav();
  return (
    <Shell route="products">
      <section className="page-wrap"><SectionHead tag="02 / PRODUCT FAMILY" title="One footprint, two chips" copy="DG32-LITE is the motor-control SoC. DG32-2DOM keeps every pin and peripheral and adds an INT8 attention engine, so a board designed for one takes the other."/>
  <div className="dr-parts">{parts.map(p=><article className="dr-part" key={p.id}><figure className="dr-part-media"><a href={url(partPosters[p.id])} target="_blank" rel="noreferrer" aria-label={`Open ${p.name} architecture diagram at full size`}><img src={url(partPosters[p.id])} alt={`${p.name} architecture diagram`} loading="lazy" decoding="async" width={800} height={450}/></a><figcaption className="mono">{p.name} · ARCHITECTURE <a href={url(partPosters[p.id])} target="_blank" rel="noreferrer">Inspect full size <ArrowUpRight size={14} aria-hidden="true"/></a></figcaption></figure><div className="dr-part-head"><span className="mono">{p.id==='lite'?'PART 01':'PART 02'} / {p.tagline.toUpperCase()}</span><h2>{p.name}</h2><span className="dr-status"><i/>{p.status}</span><p>{p.summary}</p></div><dl className="dr-specs">{p.specs.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>{p.adds.length>0&&<div className="dr-adds"><span className="mono">WHAT THE ENGINE IS FOR</span><ul>{p.adds.map(a=><li key={a}><Check size={15}/>{a}</li>)}</ul></div>}<div className="dr-part-links"><button className="primary" onClick={()=>go('architecture'+(p.id==='lite'?'':'?chip=2dom'))}>Inside the architecture <ArrowUpRight size={17}/></button><button className="text-link" onClick={()=>go('library?pkg='+p.id)}>Architecture deck and film <ArrowRight size={16}/></button><button className="text-link" onClick={()=>go('library?pkg='+p.id+'-datasheet')}>Datasheet deck and film <ArrowRight size={16}/></button></div></article>)}</div>
  <p className="disclaimer">{PRE_SILICON} The ~0.43 W power figure is a vectorless tool estimate at 25 °C and 1.8 V.</p>
  <Sec kicker="CHIP COMPARISON" title="Everything outside the engine is identical," em="DG32-2DOM adds an INT8 attention engine and a second clock, and nothing else." copy="Everything outside the engine is the same design from the same source, which is why a DG32-LITE board takes DG32-2DOM unchanged and the control-loop budget carries over exactly.">
   <DataTable caption="DG32-LITE and DG32-2DOM compared" head={['Area','DG32-LITE','DG32-2DOM']} rows={familyCompare} wide/>
  </Sec>
  <Sec kicker="WHICH CHIP FOR YOUR DRIVE" title="Same board, same firmware base," em="one added capability.">
   <ExplainedGrid cols={2} items={[
    {name:'Choose DG32-LITE',what:'For a drive that needs hardware lockstep safety, hardware FOC acceleration and native DShot in a 64-pin part.',why:'It is the first-silicon part: on the September 2026 shuttle, with bring-up measuring the loop costs, fault latency and timing it was designed to.'},
    {name:'Choose DG32-2DOM',what:'For a drive that should also watch its own motor: bearing-fault or anomaly detection on phase-current data, without a second processor.',why:'The engine runs on its own clock behind bridges, so condition monitoring cannot extend the control core’s worst-case execution time. Design complete, in physical trials.'},
   ]}/>
   <div className="dr-links dr-sec-gap">
     <button className="text-link" onClick={()=>navigate('architecture')}>Explore the architecture <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>navigate('control')}>100 kHz control-loop budget <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>navigate('pinout')}>QFN-64 package & electrical limits <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>go('library')}>Official datasheets & publication PDFs <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>go('ask')}>Query DG32-2DOM in Ask DeepGrid <ArrowUpRight size={16}/></button>
   </div>
  </Sec>

  {/* Where DG32 sits. The mature-node thesis is the organising argument of the SKU Architecture
      Compendium and it appeared nowhere on this site: without it 130 nm reads as a limitation
      rather than the choice the portfolio is built on. */}
  <Sec
    kicker="WHERE DG32 SITS"
    title="Mature-node silicon,"
    em="around the sub-10 nm core."
    copy="Sub-10 nm silicon cannot withstand 28 V to 120 V transient rails, carries no 24-bit high-dynamic-range analog front end, and does not survive automotive and military screening from −55 °C to +125 °C without external support. DeepGrid anchors those physical interfaces on 130 nm and 180 nm, taking the satellite sockets around the sub-10 nm central compute rather than competing with it. DG32 is SKU-4 of that portfolio, the lockstep safety MCU."
  >
   <div className="table-scroll">
    <table className="dr-table dr-table-wide">
     <caption>The ten-chip portfolio, and where DG32 sits in it</caption>
     <thead>
      <tr>
       <th scope="col">SKU</th><th scope="col">Part</th><th scope="col">Node</th>
       <th scope="col">Foundry</th><th scope="col">What it does</th>
      </tr>
     </thead>
     <tbody>
      {sovereignSkuHorizon.map(k => (
       <tr key={k.sku + k.name}>
        <th scope="row">{k.sku}</th>
        <td>{k.isDg32 ? <strong>{k.name}</strong> : k.name}</td>
        <td>{k.node}</td>
        <td>{k.phase}</td>
        <td>{k.targetApp}</td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>
   <p className="disclaimer">
    Portfolio, numbering and nodes reconciled on 23 September 2026 against the SKU Architecture
    Compendium (Technical Annex v3) and the Mature-Node Silicon System Architecture, which agree
    chip for chip. Phase names the sovereignty foundry, not a date: Phase 1 SkyWater, Phase 2 IHP,
    Phase 3 SCL Mohali. Anchor customers and contract values are held off this table pending
    verification.
   </p>
   <div className="dr-links dr-sec-gap">
     <button className="text-link" onClick={()=>go('library')}>Read the SKU Architecture Compendium <ArrowUpRight size={16}/></button>
     <button className="text-link" onClick={()=>go('ask')}>Ask how the portfolio fits together <ArrowUpRight size={16}/></button>
   </div>
  </Sec>
 <Related route="products"/>
 </section>
    </Shell>
  );
}
