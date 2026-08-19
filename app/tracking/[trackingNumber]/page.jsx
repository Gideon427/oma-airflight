'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'

export default function TrackingResult() {
  const { trackingNumber } = useParams()

  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchShipment = async () => {
      if (!trackingNumber) {
        setError('No tracking number provided')
        setLoading(false)
        return
      }

      try {
        const q = query(
          collection(db, 'shipments'),
          where(
            'trackingNumber',
            '==',
            trackingNumber.toUpperCase()
          )
        )

        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          setError(
            `No shipment found with tracking number: ${trackingNumber}`
          )
        } else {
          setShipment({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          })
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load tracking information')
      } finally {
        setLoading(false)
      }
    }

    fetchShipment()
  }, [trackingNumber])

  // ---------------------------------------------------------
  // PROGRESS
  // ---------------------------------------------------------

  const progress =
    shipment?.route &&
    shipment?.routeIndex !== undefined
      ? Math.round(
          ((shipment.routeIndex + 1) / shipment.route.length) * 100
        )
      : 30

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="swift-page loading-page">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Loading tracking information...</p>
        </div>

        <style jsx>{`
          .swift-page {
            min-height: 100vh;
            background: #f7f8fa;
            color: #182233;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Roboto,
              Arial,
              sans-serif;
          }

          .loading-page {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading-content {
            text-align: center;
          }

          .loading-content p {
            margin-top: 16px;
            font-size: 15px;
            color: #5d6878;
          }

          .loading-spinner {
            width: 48px;
            height: 48px;
            margin: 0 auto;
            border: 4px solid #dce4eb;
            border-top-color: #168bc0;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error || !shipment) {
    return (
      <div className="swift-page error-page">
        <div className="error-box">
          <h2>Tracking Not Found</h2>

          <p>{error || 'Shipment not found'}</p>

          <a href="/track">Try Another Tracking Number</a>
        </div>

        <style jsx>{`
          .swift-page {
            min-height: 100vh;
            background: #f7f8fa;
            color: #182233;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Roboto,
              Arial,
              sans-serif;
          }

          .error-page {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }

          .error-box {
            text-align: center;
          }

          .error-box h2 {
            color: #d32f2f;
            font-size: 28px;
            margin-bottom: 12px;
          }

          .error-box p {
            color: #5d6878;
            margin-bottom: 24px;
          }

          .error-box a {
            display: inline-block;
            padding: 10px 18px;
            background: #168bc0;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          }
        `}</style>
      </div>
    )
  }

  // ---------------------------------------------------------
  // ITEMS
  // ---------------------------------------------------------

  const items =
    shipment.items && shipment.items.length > 0
      ? shipment.items
      : shipment.package
        ? [
            {
              qty: 1,
              description:
                shipment.package.description || 'Package',
              weight: shipment.package.weight || '',
              dimensions:
                shipment.package.dimensions || '',
              value: shipment.package.value || 0,
            },
          ]
        : [
            {
              qty: 1,
              description: 'Washing Machine',
              weight: '23',
              dimensions: '',
              value: 50,
            },
          ]

  const item = items[0]

  // ---------------------------------------------------------
  // DISPLAY DATA
  // ---------------------------------------------------------

  const tracking =
    trackingNumber?.toUpperCase() || '6W2EB36PKY'

  const senderName =
    shipment.sender?.name || 'Faith'

  const senderAddress =
    shipment.sender?.address ||
    'Number 24 Grace Street\nLondon, UK'

  const receiverName =
    shipment.receiver?.name || 'Ada Grace Ijeoma'

  const receiverAddress =
    shipment.receiver?.address ||
    'Number 2 Fara Street\nLondon, UK'

  const currentLocation =
    shipment.currentLocation || 'London, UK'

  const status =
    shipment.status || 'In Transit'

  // Use a shipment date if available.
  // Otherwise the reference design date is used.
 const lastEvent = shipment.history?.[shipment.history.length - 1]
const shipmentDate = shipment.lastUpdated || lastEvent?.date || null
  const formatDateTime = () => {
    if (!shipmentDate) {
      return '15/08/2026, 19:26'
    }

    try {
      const date =
        shipmentDate?.toDate
          ? shipmentDate.toDate()
          : new Date(shipmentDate)

      if (Number.isNaN(date.getTime())) {
        return '15/08/2026, 19:26'
      }

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${day}/${month}/${year}, ${hours}:${minutes}`
    } catch {
      return '15/08/2026, 19:26'
    }
  }

  const dateTime = formatDateTime()

  const declaredValue =
    Number(item?.value || 0).toFixed(2)

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <main className="swift-page receipt-page">
      <div className="swift-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="swift-header">
          <div className="header-brand">
            <div className="brand-name">
              SWIFTSHIP
            </div>

            <div className="brand-subtitle">
              FAST &amp; RELIABLE SHIPPING SERVICES
            </div>
          </div>

          <div className="header-right">
            <div className="receipt-title">
              WAYBILL &amp; RECEIPT
            </div>

            <div className="delivery-pill">
              OUT FOR DELIVERY
            </div>
          </div>
        </header>

        {/* ==================================================
            TOP INFORMATION
        ================================================== */}

        <section className="info-card">

          <div className="info-item">
            <div className="info-label">
              TRACKING NUMBER
            </div>

            <div className="info-value tracking-value">
              {tracking}
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">
              CURRENT LOCATION
            </div>

            <div className="info-value">
              {currentLocation}
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">
              DATE &amp; TIME
            </div>

            <div className="info-value">
              {dateTime}
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">
              STATUS
            </div>

            <div className="info-value status-value">
              {status} ({progress}%)
            </div>
          </div>

        </section>

        {/* ==================================================
            PROGRESS
        ================================================== */}

        <section className="progress-card">

          <div className="progress-heading">
            <span>
              Shipment Progress
            </span>

            <span className="progress-percent">
              {progress}%
            </span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </section>

        {/* ==================================================
            SENDER / RECEIVER
        ================================================== */}

        {/* ==================================================
    SENDER / RECEIVER
================================================== */}

<section className="people-grid">

  {/* SENDER */}
  <div className="person-card">

    <div className="person-label">
      SENDER DETAILS
    </div>

    <div className="person-divider" />

    <div className="person-name">
      {shipment.sender?.name || 'Faith'}
    </div>

    <div className="person-address">
      {shipment.sender?.address ||
        'Number 24 Grace Street\nLondon, UK'}
    </div>

    <div className="person-contact">
      <div>
        <span className="contact-label">
          Phone:
        </span>

        {shipment.sender?.phone || '+44 7000 000000'}
      </div>

      <div>
        <span className="contact-label">
          Email:
        </span>

        {shipment.sender?.email || 'sender@example.com'}
      </div>
    </div>

  </div>


  {/* RECEIVER */}
  <div className="person-card">

    <div className="person-label">
      RECEIVER DETAILS
    </div>

    <div className="person-divider" />

    <div className="person-name">
      {shipment.receiver?.name ||
        'Ada Grace Ijeoma'}
    </div>

    <div className="person-address">
      {shipment.receiver?.address ||
        'Number 2 Fara Street\nLondon, UK'}
    </div>

    <div className="person-contact">
      <div>
        <span className="contact-label">
          Phone:
        </span>

        {shipment.receiver?.phone || '+44 7000 000000'}
      </div>

      <div>
        <span className="contact-label">
          Email:
        </span>

        {shipment.receiver?.email || 'receiver@example.com'}
      </div>
    </div>

  </div>

</section>

        {/* ==================================================
            PACKAGE DETAILS
        ================================================== */}

        <section className="package-section">

          <h2 className="package-title">
            Package Details
          </h2>

          <div className="package-table">

            <div className="table-header">
              <div>
                ITEM DESCRIPTION
              </div>

              <div className="weight-column">
                WEIGHT
              </div>

              <div className="value-column">
                DECLARED VALUE
              </div>
            </div>

            <div className="table-row">

              <div>
                {item?.description || 'Washing Machine'}
              </div>

              <div className="weight-column">
                {item?.weight
                  ? `${item.weight} kg`
                  : '23 kg'}
              </div>

              <div className="value-column">
                ${declaredValue}
              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            DIVIDER
        ================================================== */}

        <div className="bottom-divider" />

        {/* ==================================================
            BARCODE + FOOTER
        ================================================== */}

        <section className="bottom-section">

          <div className="barcode-box">

            <div className="barcode">
              <span>|||</span>
              <span>|</span>
              <span>||||</span>
              <span>|||</span>
              <span>|||</span>
            </div>

            <div className="barcode-number">
              *{tracking}*
            </div>

          </div>

          <div className="footer-note">
            SwiftShip Courier Services: Live location status
            updated as of {dateTime}. Track real-time progress
            online at www.swiftship.com/track.
          </div>

          <div className="bottom-actions">
            <button
              type="button"
              className="btn-print"
              onClick={handlePrint}
            >
              Print Slip
            </button>
          </div>

        </section>

      </div>

      {/* ====================================================
          EXACT PAGE STYLING
      ==================================================== */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .swift-page {
          min-height: 100vh;
          width: 100%;
          background: #f7f8fa;
          color: #182233;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;

          padding: 40px 20px 80px;
        }
          /* ================================================
   CONTACT DETAILS
================================================ */

.person-contact {
  margin-top: 9px;

  color: #65717d;

  font-size: 11px;
  line-height: 1.55;
}

.person-contact > div {
  display: block;
}

.contact-label {
  color: #3f4b58;
  font-weight: 600;
  margin-right: 5px;
}

        .swift-container {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        /* ================================================
           HEADER
        ================================================= */

        .swift-header {
          height: 101px;
          width: 100%;

          background: #0d1729;

          border-radius: 13px;

          padding: 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: white;
        }

        .header-brand {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .brand-name {
          font-size: 25px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.2px;
          color: #ffffff;
        }

        .brand-subtitle {
          margin-top: 8px;

          font-size: 9px;
          line-height: 1;

          font-weight: 400;
          letter-spacing: 0.25px;

          color: #9da6b4;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .receipt-title {
          font-size: 18px;
          line-height: 1;

          font-weight: 800;

          color: #2fa9df;

          letter-spacing: 0.15px;
        }

        .delivery-pill {
          margin-top: 14px;

          height: 26px;

          padding: 0 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          border: 1px solid #1595ce;

          color: #55b7e5;

          font-size: 9px;
          font-weight: 600;

          letter-spacing: 0.2px;
        }

        /* ================================================
           INFORMATION CARD
        ================================================= */

        .info-card {
          width: 100%;

          min-height: 71px;

          margin-top: 14px;

          background: #ffffff;

          border: 1px solid #dce1e6;

          border-radius: 11px;

          display: grid;

          grid-template-columns:
            1.15fr
            1.1fr
            1.1fr
            1.05fr;

          align-items: center;
        }

        .info-item {
          padding: 13px 19px;
          min-width: 0;
        }

        .info-label {
          font-size: 8px;
          line-height: 1;

          color: #697582;

          font-weight: 500;

          letter-spacing: 0.15px;

          white-space: nowrap;
        }

        .info-value {
          margin-top: 9px;

          font-size: 13px;
          line-height: 1;

          font-weight: 700;

          color: #182233;

          white-space: nowrap;
        }

        .tracking-value,
        .status-value {
          color: #138abd;
        }

        /* ================================================
           PROGRESS
        ================================================= */

        .progress-card {
          width: 100%;

          margin-top: 14px;

          padding: 14px 19px 15px;

          background: #ffffff;

          border: 1px solid #dce1e6;

          border-radius: 11px;
        }

        .progress-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 9px;

          font-size: 13px;
          line-height: 1;

          font-weight: 700;

          color: #182233;
        }

        .progress-percent {
          color: #138abd;
        }

        .progress-track {
          width: 100%;
          height: 13px;

          background: #e9edf1;

          border-radius: 8px;

          overflow: hidden;
        }

        .progress-fill {
          height: 100%;

          background: #168dc1;

          border-radius: 8px;

          position: relative;
        }

        .progress-fill::after {
          content: "";

          position: absolute;

          right: -1px;
          top: 0;

          width: 12px;
          height: 100%;

          background: #168dc1;

          clip-path: polygon(
            0 0,
            100% 50%,
            0 100%
          );
        }

        /* ================================================
           SENDER / RECEIVER
        ================================================= */

        .people-grid {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 18px;

          margin-top: 14px;
        }

        .person-card {
          min-height: 141px;

          background: #ffffff;

          border: 1px solid #dce1e6;

          border-radius: 11px;

          padding: 15px 19px;
        }

        .person-label {
          color: #1589bb;

          font-size: 9px;
          line-height: 1;

          font-weight: 500;

          letter-spacing: 0.25px;
        }

        .person-divider {
          width: 100%;

          height: 1px;

          background: #e7eaed;

          margin-top: 8px;
          margin-bottom: 11px;
        }

        .person-name {
          font-size: 13px;
          line-height: 1.1;

          font-weight: 700;

          color: #182233;
        }

        .person-address {
          margin-top: 7px;

          white-space: pre-line;

          font-size: 12px;
          line-height: 1.35;

          color: #65717d;
        }

        /* ================================================
           PACKAGE
        ================================================= */

        .package-section {
          margin-top: 18px;
        }

        .package-title {
          margin: 0 0 10px;

          font-size: 18px;
          line-height: 1;

          font-weight: 800;

          color: #182233;
        }

        .package-table {
          width: 100%;

          overflow: hidden;

          border: 1px solid #dce1e6;

          border-radius: 0;

          background: white;
        }

        .table-header,
        .table-row {
          display: grid;

          grid-template-columns:
            1fr
            160px
            120px;
        }

        .table-header {
          min-height: 34px;

          background: #f0f3f7;

          color: #52606d;

          font-size: 9px;
          line-height: 1;

          font-weight: 500;

          align-items: center;

          padding: 0 19px;
        }

        .table-row {
          min-height: 51px;

          align-items: center;

          padding: 0 19px;

          color: #182233;

          font-size: 12px;
          font-weight: 500;

          border-top: 1px solid #dce1e6;
        }

        .weight-column {
          text-align: center;
        }

        .value-column {
          text-align: right;
        }

        /* ================================================
           BOTTOM DIVIDER
        ================================================= */

        .bottom-divider {
          width: 100%;

          height: 1px;

          background: #cfd5db;

          margin-top: 29px;
        }

        /* ================================================
           BOTTOM
        ================================================= */

        .bottom-section {
          display: flex;

          align-items: flex-start;

          gap: 19px;

          margin-top: 19px;
        }

        .barcode-box {
          width: 221px;
          min-width: 221px;

          height: 72px;

          background: #ffffff;

          border: 1px solid #dce1e6;

          border-radius: 10px;

          padding: 13px 14px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .barcode {
          width: 100%;

          display: flex;

          justify-content: center;
          align-items: center;

          gap: 8px;

          height: 18px;

          color: #111827;

          font-family:
            "Courier New",
            Courier,
            monospace;

          font-size: 15px;

          letter-spacing: 2px;

          overflow: hidden;
        }

        .barcode span {
          display: inline-block;
        }

        .barcode-number {
          margin-top: 6px;

          color: #697582;

          font-size: 9px;
          line-height: 1;

          letter-spacing: 0.1px;
        }

        .footer-note {
          max-width: 350px;

          padding-top: 9px;

          color: #65717d;

          font-size: 11px;

          line-height: 1.4;
        }

        .bottom-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
        }

        .btn-print {
          padding: 8px 12px;
          background: #168bc1;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          margin-left: 12px;
          box-shadow: 0 2px 6px rgba(23, 106, 148, 0.12);
        }

        .btn-print:hover {
          opacity: 0.95;
        }

        /* ================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 700px) {

          .swift-page {
            padding: 20px 12px 50px;
          }

          .swift-container {
            max-width: 100%;
          }

          .swift-header {
            height: auto;
            min-height: 101px;

            padding: 19px 17px;

            gap: 15px;
          }

          .brand-name {
            font-size: 21px;
          }

          .receipt-title {
            font-size: 14px;
            text-align: right;
          }

          .delivery-pill {
            font-size: 8px;
            height: 24px;
            padding: 0 10px;
          }

          .info-card {
            grid-template-columns: 1fr 1fr;

            padding: 4px 0;
          }

          .info-item {
            padding: 11px 14px;
          }

          .info-value {
            font-size: 12px;
          }

          .people-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .table-header,
          .table-row {
            grid-template-columns:
              minmax(0, 1fr)
              90px
              90px;
          }

          .table-header,
          .table-row {
            padding-left: 12px;
            padding-right: 12px;
          }

          .bottom-section {
            flex-direction: column;
          }

          .barcode-box {
            width: 221px;
          }

          .footer-note {
            max-width: 100%;
          }
        }

        @media (max-width: 430px) {

          .swift-header {
            align-items: flex-start;
          }

          .brand-subtitle {
            font-size: 7px;
          }

          .receipt-title {
            font-size: 11px;
          }

          .delivery-pill {
            font-size: 7px;
          }

          .info-card {
            grid-template-columns: 1fr;
          }

          .info-item {
            padding: 10px 14px;
          }

          .info-value {
            margin-top: 7px;
          }

          .progress-card {
            padding-left: 14px;
            padding-right: 14px;
          }

          .package-title {
            font-size: 17px;
          }

          .table-header,
          .table-row {
            grid-template-columns:
              minmax(0, 1fr)
              70px
              75px;

            font-size: 10px;
          }

          .table-row {
            font-size: 10px;
          }
        }

        /* ================================================
           PRINT
        ================================================= */

        @media print {

          .swift-page {
            background: #f7f8fa !important;

            padding: 0;

            min-height: auto;
          }

          .swift-container {
            max-width: 720px;
          }

          .swift-header,
          .info-card,
          .progress-card,
          .person-card,
          .package-table,
          .barcode-box {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            size: A4;
            margin: 15mm;
          }

          /* Hide interactive controls when printing */
          .btn-print {
            display: none !important;
          }
        }

      `}</style>
    </main>
  )
}