import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/')
      return
    }
    if (!authLoading && isAuthenticated && user?.role !== 'admin') {
      navigate('/')
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const { data: reservations, isLoading: reservationsLoading } = trpc.reservation.list.useQuery(
    undefined,
    { enabled: user?.role === 'admin' }
  )

  const utils = trpc.useUtils()
  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      utils.reservation.list.invalidate()
    },
  })

  const filteredReservations = reservations?.filter((r) => {
    if (filter === 'all') return true
    return r.status === filter
  })

  const statusCounts = {
    all: reservations?.length ?? 0,
    pending: reservations?.filter((r) => r.status === 'pending').length ?? 0,
    confirmed: reservations?.filter((r) => r.status === 'confirmed').length ?? 0,
    cancelled: reservations?.filter((r) => r.status === 'cancelled').length ?? 0,
  }

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}>
        <p style={{ fontSize: '14px', color: '#666' }}>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          padding: '0 clamp(20px, 4vw, 60px)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              color: '#000',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            AETHERIS
          </span>
          <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Admin Dashboard
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#666',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Back to Site
        </button>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px clamp(20px, 4vw, 60px)' }}>
        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '24px',
                backgroundColor: filter === s ? '#000' : '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: filter === s ? 'rgba(255,255,255,0.6)' : '#999',
                  marginBottom: '8px',
                }}
              >
                {s}
              </p>
              <p
                style={{
                  fontSize: '32px',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  color: filter === s ? '#fff' : '#000',
                }}
              >
                {statusCounts[s]}
              </p>
            </button>
          ))}
        </div>

        {/* Reservations Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#000' }}>
              Reservations
            </h2>
            <span style={{ fontSize: '12px', color: '#999' }}>
              {filteredReservations?.length ?? 0} entries
            </span>
          </div>

          {reservationsLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
              Loading reservations...
            </div>
          ) : filteredReservations && filteredReservations.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <Th>ID</Th>
                    <Th>Guest</Th>
                    <Th>Email</Th>
                    <Th>Residence</Th>
                    <Th>Check-in</Th>
                    <Th>Check-out</Th>
                    <Th>Guests</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((r) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                    >
                      <Td>#{r.id}</Td>
                      <Td>{r.fullName}</Td>
                      <Td style={{ fontSize: '13px', color: '#666' }}>{r.email}</Td>
                      <Td>{r.roomType}</Td>
                      <Td>{r.checkInDate || '—'}</Td>
                      <Td>{r.checkOutDate || '—'}</Td>
                      <Td>{r.guests}</Td>
                      <Td>
                        <StatusBadge status={r.status} />
                      </Td>
                      <Td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {r.status === 'pending' && (
                            <>
                              <ActionBtn
                                onClick={() => updateStatus.mutate({ id: r.id, status: 'confirmed' })}
                                label="Confirm"
                              />
                              <ActionBtn
                                onClick={() => updateStatus.mutate({ id: r.id, status: 'cancelled' })}
                                label="Cancel"
                                danger
                              />
                            </>
                          )}
                          {r.status === 'confirmed' && (
                            <ActionBtn
                              onClick={() => updateStatus.mutate({ id: r.id, status: 'cancelled' })}
                              label="Cancel"
                              danger
                            />
                          )}
                          {r.status === 'cancelled' && (
                            <ActionBtn
                              onClick={() => updateStatus.mutate({ id: r.id, status: 'pending' })}
                              label="Restore"
                            />
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
              No reservations found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: '14px 16px',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#999',
        textAlign: 'left',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </th>
  )
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td
      style={{
        padding: '14px 16px',
        fontSize: '14px',
        color: '#333',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </td>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#fff8e1', text: '#f9a825' },
    confirmed: { bg: '#e8f5e9', text: '#2e7d32' },
    cancelled: { bg: '#fce4ec', text: '#c62828' },
  }
  const c = colors[status] || colors.pending
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        backgroundColor: c.bg,
        color: c.text,
        borderRadius: '2px',
      }}
    >
      {status}
    </span>
  )
}

function ActionBtn({ onClick, label, danger }: { onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        backgroundColor: 'transparent',
        color: danger ? '#c62828' : '#333',
        border: `1px solid ${danger ? 'rgba(198,40,40,0.3)' : 'rgba(0,0,0,0.12)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = danger ? '#c62828' : '#333'
        e.currentTarget.style.color = '#fff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.color = danger ? '#c62828' : '#333'
      }}
    >
      {label}
    </button>
  )
}
