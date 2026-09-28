import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import JsBarcode from 'jsbarcode'
import {
  Home, Users, UserPlus, RefreshCw, CreditCard, BarChart3, Layers3,
  Settings, Search, Pencil, Pause, MoreHorizontal, CheckCircle2,
  Tag, User, ShieldCheck, Gift, CalendarDays
} from 'lucide-react'
import './styles.css'

const tiers = {
  Pilar: { label: 'THE PILAR', code: 'PI', discount: 0, accent: '#e8e8e8' },
  Sentinel: { label: 'THE SENTINEL', code: 'S', discount: 0, accent: '#1890ff' },
  Paladin: { label: 'THE PALADIN', code: 'P', discount: 10, accent: '#d4a94f' },
  Paragon: { label: 'THE PARAGON', code: 'PA', discount: 10, accent: '#b143ff' },
}

const initialMembers = [
  {
    id: 'GB-P-001247', name: 'Joshua Clark', email: 'joshua.clark@example.com', phone: '',
    tier: 'Paladin', status: 'Active', joined: '2024-11-14', lastVisit: '2024-11-28',
    activationDate: '2024-11-14', expiryDate: '2027-11-13', autoRenew: false,
    cardNumber: 'GB-P-001247', barcode: '5063012470018', issued: '2024-11-14', cardStatus: 'Active',
    image: '/joshua-clark.jpg'
  },
  {
    id: 'GB-S-001248', name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '',
    tier: 'Sentinel', status: 'Active', joined: '2025-02-01', lastVisit: '2026-09-20',
    activationDate: '2025-02-01', expiryDate: '2027-01-31', autoRenew: true,
    cardNumber: 'GB-S-001248', barcode: '5063012480002', issued: '2025-02-01', cardStatus: 'Active'
  }
]

function fmtDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Barcode({ value, className='' }) {
  const ref = React.useRef(null)
  useEffect(() => {
    if (ref.current) JsBarcode(ref.current, value, { format: 'CODE128', displayValue: true, height: 48, margin: 4, fontSize: 14 })
  }, [value])
  return <svg ref={ref} className={className} aria-label={`Barcode ${value}`} />
}

function App() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('gtb-members')
    return saved ? JSON.parse(saved) : initialMembers
  })
  const [selectedId, setSelectedId] = useState(members[0].id)
  const [query, setQuery] = useState('')
  const [scanInput, setScanInput] = useState('')
  const [scanResult, setScanResult] = useState(members[0])
  const [tab, setTab] = useState('Membership & Cards')

  useEffect(() => localStorage.setItem('gtb-members', JSON.stringify(members)), [members])
  const member = members.find(m => m.id === selectedId) || members[0]
  const tier = tiers[member.tier]
  const filtered = useMemo(() => members.filter(m => `${m.name} ${m.id} ${m.email} ${m.cardNumber} ${m.barcode}`.toLowerCase().includes(query.toLowerCase())), [members, query])

  function patchMember(patch) {
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, ...patch } : m))
  }

  function renew() {
    const next = new Date(member.expiryDate + 'T00:00:00')
    next.setFullYear(next.getFullYear() + 1)
    patchMember({ expiryDate: next.toISOString().slice(0,10), status: 'Active', cardStatus: 'Active' })
  }

  function deactivate() {
    patchMember({ status: member.status === 'Active' ? 'Inactive' : 'Active', cardStatus: member.status === 'Active' ? 'Inactive' : 'Active' })
  }

  function scan() {
    const found = members.find(m => [m.barcode, m.cardNumber, m.id].includes(scanInput.trim()))
    setScanResult(found || { invalid: true })
  }

  function addMember() {
    const n = members.length + 1249
    const fresh = {
      id: `GB-PI-${String(n).padStart(6,'0')}`, name: `New Member ${n}`, email: '', phone: '', tier: 'Pilar', status: 'Active',
      joined: new Date().toISOString().slice(0,10), lastVisit: new Date().toISOString().slice(0,10), activationDate: new Date().toISOString().slice(0,10),
      expiryDate: new Date(Date.now()+365*86400000).toISOString().slice(0,10), autoRenew: false,
      cardNumber: `GB-PI-${String(n).padStart(6,'0')}`, barcode: `5063${String(n).padStart(9,'0')}`.slice(0,13), issued: new Date().toISOString().slice(0,10), cardStatus: 'Active'
    }
    setMembers(p => [...p, fresh]); setSelectedId(fresh.id)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><img src="/gtb-logo.png" /><div><strong>THE<br/>GAMES BUNKER</strong><span>PLAY • COLLECT • EXPLORE • BELONG</span></div></div>
        <nav>
          <button className="active"><Home/>Dashboard</button><button><Users/>Members</button><button onClick={addMember}><UserPlus/>New Member</button>
          <button><RefreshCw/>Renewals</button><button><CreditCard/>Card Management</button><button><BarChart3/>Reports</button>
          <button><Layers3/>Membership Tiers</button><button><Settings/>Settings</button>
        </nav>
        <div className="sidebar-logo"><img src="/gtb-logo.png"/><b>THE GAMES BUNKER</b></div>
      </aside>

      <main>
        <header className="topbar">
          <div><h1>Membership Management</h1><p>Become the heart of the Community.</p></div>
          <div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search members, card number or email..."/></div>
          <div className="staff"><User/><div><b>Staff User</b><span>Manager</span></div></div>
        </header>

        <section className="workspace">
          <div className="left-col">
            <div className="section-title"><h2>Member Details</h2><span>Members › {member.name}</span><button><Pencil/>Edit Member</button></div>
            <div className="member-panel">
              <img className="portrait" src={member.image || '/joshua-clark.jpg'} />
              <div className="member-core"><div className="name-row"><h2>{member.name}</h2><span className={`pill ${member.status.toLowerCase()}`}>{member.status.toUpperCase()}</span></div>
                <dl><dt>Member No.</dt><dd>{member.id}</dd><dt>Email</dt><dd>{member.email || 'Not provided'}</dd><dt>Phone</dt><dd>{member.phone || 'Not provided'}</dd><dt>Date Joined</dt><dd>{fmtDate(member.joined)}</dd><dt>Last Visit</dt><dd>{fmtDate(member.lastVisit)}</dd></dl>
              </div>
              <div className="tier-panel" style={{'--accent': tier.accent}}><div className="tier-badge"><img src="/gtb-logo.png"/><strong>{tier.label}</strong></div>
                <dl><dt>Membership Type</dt><dd>The {member.tier}</dd><dt>Discount Level</dt><dd>{tier.discount}%</dd><dt>Activation Date</dt><dd>{fmtDate(member.activationDate)}</dd><dt>Expiry Date</dt><dd>{fmtDate(member.expiryDate)}</dd><dt>Auto Renew</dt><dd>{member.autoRenew ? 'Yes' : 'No'}</dd></dl>
              </div>
              <div className="actions"><button className="gold" onClick={renew}><RefreshCw/>Renew Membership</button><button><CreditCard/>Replace Card</button><button onClick={deactivate}><Pause/>{member.status==='Active'?'Deactivate':'Activate'}</button><button><MoreHorizontal/>More Actions</button></div>
            </div>

            <div className="tabs">{['Membership & Cards','Transaction History','Benefits','Notes','Audit Log'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
            <div className="detail-grid">
              <article><h3><CheckCircle2/>Active Membership</h3><dl><dt>Tier</dt><dd>The {member.tier}</dd><dt>Status</dt><dd className="green">{member.status}</dd><dt>Discount</dt><dd>{tier.discount}%</dd><dt>Valid From</dt><dd>{fmtDate(member.activationDate)}</dd><dt>Valid Until</dt><dd>{fmtDate(member.expiryDate)}</dd></dl></article>
              <article><h3><CreditCard/>Membership Card</h3><dl><dt>Card Number</dt><dd>{member.cardNumber}</dd><dt>Barcode</dt><dd>{member.barcode}</dd><dt>Issued</dt><dd>{fmtDate(member.issued)}</dd><dt>Status</dt><dd>{member.cardStatus}</dd></dl></article>
              <article><h3><Gift/>Tier Benefits</h3><ul><li>10% Discount (Paladin / Paragon)</li><li>Sentinel tier benefits</li><li>Priority booking</li><li>Exclusive member content</li></ul></article>
            </div>

            <div className="members-list"><div className="members-list-head"><b>Members</b><span>{filtered.length} shown</span></div>{filtered.map(m=><button key={m.id} onClick={()=>setSelectedId(m.id)} className={m.id===member.id?'selected':''}><span>{m.name}</span><small>{m.id} · {m.tier} · {m.status}</small></button>)}</div>
          </div>

          <aside className="epos-panel">
            <div className="epos-head"><h2>EPOS Membership Scan</h2><span>● Connected</span></div>
            <div className="scan-box"><input value={scanInput} onChange={e=>setScanInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&scan()} placeholder="Scan barcode / card ID"/><button onClick={scan}>Scan</button></div>
            {scanResult?.invalid ? <div className="invalid-card"><b>MEMBER NOT FOUND</b><p>No valid membership matched that code.</p></div> : <>
              <div className={`verified ${scanResult.status==='Active'?'':'inactive-verify'}`}><ShieldCheck/><b>{scanResult.status==='Active'?'MEMBER VERIFIED':'MEMBERSHIP INACTIVE'}</b><span>{scanResult.status==='Active'?'Apply member benefits to this transaction.':'Do not apply membership discount.'}</span></div>
              <div className="epos-member"><img src={scanResult.image || '/joshua-clark.jpg'}/><div><h3>{scanResult.name}</h3><b>{scanResult.id}</b><span className="tier-chip">THE {scanResult.tier.toUpperCase()}</span></div><dl><dt>Status</dt><dd>{scanResult.status}</dd><dt>Member Discount</dt><dd>{tiers[scanResult.tier].discount}%</dd><dt>Valid Until</dt><dd>{fmtDate(scanResult.expiryDate)}</dd></dl><Barcode value={scanResult.barcode}/></div>
              <button className="apply"><Tag/>Apply {tiers[scanResult.tier].discount}% Member Discount</button>
            </>}
          </aside>
        </section>

        <section className="cards-section"><h2>Physical Membership Cards</h2><div className="cards-row">{Object.entries(tiers).map(([name,t])=><MemberCard key={name} name={name} tier={t} member={member}/>)}</div></section>
      </main>
    </div>
  )
}

function MemberCard({name,tier,member}) {
  const code = `5063${member.id.replace(/\D/g,'').padStart(9,'0')}`.slice(0,13)
  return <div className="member-card" style={{'--accent':tier.accent}}><div className="card-top"><img src="/gtb-logo.png"/><b>{tier.label}</b></div><div className="card-body"><img src={member.image || '/joshua-clark.jpg'}/><div><strong>{member.name}</strong><span>GB-{tier.code}-001247</span></div></div><Barcode value={code}/></div>
}

createRoot(document.getElementById('root')).render(<App />)
