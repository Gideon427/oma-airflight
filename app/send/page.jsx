'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SendPackage() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  const [formData, setFormData] = useState({
    sender: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    receiver: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    package: {
      description: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      value: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.startsWith('dimensions.') || name === 'package.weight' || name === 'package.value'
        ? value === '' ? '' : parseFloat(value) || ''
        : value;

    setFormData((prev) => {
      if (name.startsWith('sender.') || name.startsWith('receiver.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: parsedValue,
          },
        };
      } else if (name.startsWith('package.')) {
        const [, child] = name.split('.');
        return {
          ...prev,
          package: {
            ...prev.package,
            [child]: parsedValue,
          },
        };
      } else if (name.startsWith('dimensions.')) {
        const dim = name.split('.')[1];
        return {
          ...prev,
          package: {
            ...prev.package,
            dimensions: {
              ...prev.package.dimensions,
              [dim]: parsedValue,
            },
          },
        };
      }
      return prev;
    });
  };

  const generateTrackingNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 10; i += 1) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(window.localStorage.getItem('role') || '');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAuthorized = role === 'admin' || role === 'worker';

    if (!isAuthorized) {
      setError('Only a worker or admin may send a package. Please login on the admin page.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const trackingNumber = generateTrackingNumber();
      setTrackingCode(trackingNumber);

      const shipment = {
        trackingNumber,
        sender: formData.sender,
        receiver: formData.receiver,
        package: formData.package,
        status: 'pending',
        currentLocation: formData.sender.address || 'Origin',
        history: [
          {
            status: 'pending',
            location: formData.sender.address || 'Origin',
            description: 'Package received and ready for shipment',
            date: new Date().toISOString(),
          },
        ],
      };

      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('shipments') : null;
      const shipments = stored ? JSON.parse(stored) : [];
      window.localStorage.setItem('shipments', JSON.stringify([...shipments, shipment]));

      setTimeout(() => {
        router.push(`/tracking/${trackingNumber}`);
      }, 1600);
    } catch (err) {
      setError(err.message || 'Failed to generate tracking number');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="card form-container">
          <div className="card-header">
            <h1>Send a Package</h1>
          </div>
          <div className="card-body">
            {!(role === 'admin' || role === 'worker') ? (
              <div className="send-access-container">
                <div className="alert alert-info">
                  <h2 className="text-lg font-semibold mb-3">Access Restricted</h2>
                  <p className="mb-4">
                    Only admins and workers can send packages. Please login or signup to continue.
                  </p>
                  <Link href="/admin" className="btn btn-primary">
                    Go to Admin Panel
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-error">{error}</div>}
                {trackingCode && (
                  <div className="alert alert-success">
                    Tracking code generated: <strong>{trackingCode}</strong>
                    <span className="tracking-note"> Redirecting shortly...</span>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Sender Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sender-name">Full Name</label>
                    <input
                      type="text"
                      id="sender-name"
                      name="sender.name"
                      value={formData.sender.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sender-address">Address</label>
                    <input
                      type="text"
                      id="sender-address"
                      name="sender.address"
                      value={formData.sender.address}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sender-email">Email</label>
                    <input
                      type="email"
                      id="sender-email"
                      name="sender.email"
                      value={formData.sender.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sender-phone">Phone</label>
                    <input
                      type="tel"
                      id="sender-phone"
                      name="sender.phone"
                      value={formData.sender.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h2>Receiver Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="receiver-name">Full Name</label>
                    <input
                      type="text"
                      id="receiver-name"
                      name="receiver.name"
                      value={formData.receiver.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="receiver-address">Address</label>
                    <input
                      type="text"
                      id="receiver-address"
                      name="receiver.address"
                      value={formData.receiver.address}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="receiver-email">Email</label>
                    <input
                      type="email"
                      id="receiver-email"
                      name="receiver.email"
                      value={formData.receiver.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="receiver-phone">Phone</label>
                    <input
                      type="tel"
                      id="receiver-phone"
                      name="receiver.phone"
                      value={formData.receiver.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h2>Package Details</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="package-description">Description</label>
                    <input
                      type="text"
                      id="package-description"
                      name="package.description"
                      value={formData.package.description}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="package-weight">Weight (kg)</label>
                    <input
                      type="number"
                      id="package-weight"
                      name="package.weight"
                      value={formData.package.weight}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dimensions-length">Dimensions (cm)</label>
                    <div className="dimensions-grid">
                      <input
                        type="number"
                        id="dimensions-length"
                        placeholder="Length"
                        name="dimensions.length"
                        value={formData.package.dimensions.length}
                        onChange={handleChange}
                        className="form-input"
                        min="0"
                        step="0.1"
                        required
                      />
                      <input
                        type="number"
                        id="dimensions-width"
                        placeholder="Width"
                        name="dimensions.width"
                        value={formData.package.dimensions.width}
                        onChange={handleChange}
                        className="form-input"
                        min="0"
                        step="0.1"
                        required
                      />
                      <input
                        type="number"
                        id="dimensions-height"
                        placeholder="Height"
                        name="dimensions.height"
                        value={formData.package.dimensions.height}
                        onChange={handleChange}
                        className="form-input"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="package-value">Declared Value ($)</label>
                    <input
                      type="number"
                      id="package-value"
                      name="package.value"
                      value={formData.package.value}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Ship Package'}
                </button>
              </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}