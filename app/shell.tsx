'use client';

import {useEffect, useState} from 'react';
import {ArrowUpRight, ArrowRight, ArrowLeft, Menu, X} from 'lucide-react';
import {navRoutes, byId, nextRoute, prevRoute, resolveTarget, url, type RouteId} from './routes';
import {useReveal, useScrollVars} from './motion';
import {useDraw, useRail} from './devices';

function Brand() {
  return (
    <>
      <span className="brand-mark"><i/><i/><i/><i/></span>
      <span className="wordmark">deepgrid<span>SEMI</span></span>
    </>
  );
}

export function Shell({
  route,
  children,
  reduced,
}: {
  route: RouteId;
  children: React.ReactNode;
  reduced?: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const here = byId[route];
  const parent = here.parent ? byId[here.parent] : undefined;
  const next = nextRoute(route);
  const prev = prevRoute(route);
  const href = url;

  useScrollVars();
  useReveal(route);
  useDraw(route);
  useRail(route);

  const links = navRoutes.map(r => (
    <a
      key={r.id}
      href={href(r.href)}
      className={route === r.id || here.parent === r.id ? 'active' : ''}
      aria-current={route === r.id ? 'page' : undefined}
      onClick={() => setMenu(false)}
    >
      {r.label}
    </a>
  ));

  return (
    <div className={'site-shell view-' + route}>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="topbar">
        <a className="brand" href={href('/')} aria-label="DeepGrid Semi home"><Brand/></a>
        <div className="topline">
          <span>DG32 · LOCKSTEP RISC-V MOTOR-CONTROL SILICON</span>
          <span className="status-dot">FIRST SILICON · SEP 2026</span>
        </div>
        <a className="contact-link" href={href('/contact')}>Discuss your application <ArrowUpRight size={17}/></a>
        <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenu(true)}>
          <span>{here.label}</span><Menu/>
        </button>
      </header>

      <nav className="main-nav" aria-label="Primary navigation">{links}</nav>

      {menu && (
        <div className="navigation-sheet mobile-sheet" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="mobile-sheet-close" aria-label="Close navigation" onClick={() => setMenu(false)}><X aria-hidden="true"/></button>
          <nav aria-label="Primary">{links}</nav>
        </div>
      )}

      <main id="main" tabIndex={-1}>
        {route !== 'home' && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href={href('/')}>Home</a>
            <span>/</span>
            {parent && <><a href={href(parent.href)}>{parent.label}</a><span>/</span></>}
            <span aria-current="page">{here.label}</span>
          </nav>
        )}

        {(route === 'technology' || here.parent === 'technology') && (
          <nav className="technology-nav" aria-label="Technology sections">
            {(['technology', 'safety', 'control', 'die', 'package'] as const).map(id => (
              <a key={id} href={href(byId[id].href)} aria-current={route === id ? 'page' : undefined}>{byId[id].label}</a>
            ))}
          </nav>
        )}
        {children}

        {(prev || next) && (
          <nav className="section-pagination" aria-label="Section navigation">
            {prev ? (
              <a href={href(prev.href)}>
                <ArrowLeft size={19} aria-hidden="true"/>
                <span><small>Previous section</small>{prev.label}</span>
              </a>
            ) : <span/>}
            {next && (
              <a href={href(next.href)}>
                <span><small>Next section</small>{next.label}</span>
                <ArrowRight size={19} aria-hidden="true"/>
              </a>
            )}
          </nav>
        )}
      </main>

      <footer className="footer">
        <div className="footer-top">
          <a className="brand" href={href('/')} aria-label="DeepGrid Semi home"><Brand/></a>
          <h2>Safety in the core.<br/><em>Control in silicon.</em></h2>
          <a className="text-link" href="https://deepgridsemi.com" target="_blank" rel="noreferrer">
            deepgridsemi.com <ArrowUpRight size={20}/>
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DEEPGRID SEMI PVT LTD</span>
          <span>HYDERABAD · INDIA</span>
          <span>PRE-SILICON · DESIGN VALUES, NOT MEASUREMENTS</span>
          <a href={href('/resources')}>Documents &amp; media ↗</a>
        </div>
      </footer>
    </div>
  );
}

/** prefers-reduced-motion, read once per page. */
export function useReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Query-string state, replacing the old hash router's params. Static-export safe. */
export function useQuery(): [URLSearchParams, (changes: Record<string, string | undefined>) => void] {
  const [params, setParams] = useState(() => new URLSearchParams());
  useEffect(() => {
    setParams(new URLSearchParams(location.search));
    const sync = () => setParams(new URLSearchParams(location.search));
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, []);
  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(location.search);
    for (const [k, v] of Object.entries(changes)) { if (v) next.set(k, v); else next.delete(k); }
    history.replaceState(history.state, '', location.pathname + (next.size ? '?' + next : '') + location.hash);
    setParams(next);
  };
  return [params, update];
}

/** Navigation for ported page bodies. `navigate('pinout')` and `go('library?pkg=lite')`
 *  keep working against the real URL map, and `href()` gives an anchor the same answer. */
export function useNav() {
  const href = (target: string) => resolveTarget(target);
  const navigate = (target: string) => { location.assign(href(target)); };
  return {href, navigate, go: navigate};
}
