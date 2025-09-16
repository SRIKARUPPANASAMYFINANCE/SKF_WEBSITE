import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { createApplication } from '../services/api';
import './ApplyForLoan.css';

const INTEREST_RATE_PER_PERIOD = 0.25; // 25% per week or month

const ApplyForLoan = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const planFromURL = queryParams.get('plan');

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    isWhatsApp: true,
    email: '',
    loanAmount: '',
    purpose: '',
    loanType: planFromURL || 'weekly',
    tenure: '',
    address: '',
    totalRepayable: 0,
    installment: 0,
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState({
    type: '',
    text: '',
    applicationId: '',
  });
  const [loading, setLoading] = useState(false);

  // Function to calculate loan details
  const calculateLoanDetails = useCallback(() => {
    const amount = parseFloat(formData.loanAmount);
    const tenure = parseInt(formData.tenure);

    if (amount > 0 && tenure > 0) {
      const totalInterest = amount * INTEREST_RATE_PER_PERIOD; // 25% of principal
      const totalRepayable = amount + totalInterest;
      const installment = totalRepayable / tenure;
      setFormData((prev) => ({
        ...prev,
        totalRepayable: parseFloat(totalRepayable.toFixed(2)),
        installment: parseFloat(installment.toFixed(2)),
      }));
    } else {
      setFormData((prev) => ({ ...prev, totalRepayable: 0, installment: 0 }));
    }
  }, [formData.loanAmount, formData.tenure]);

  // Set default tenure based on loanType and recalculate loan details
  useEffect(() => {
    if (formData.loanType === 'weekly') {
      setFormData((prev) => ({ ...prev, tenure: 10 }));
    } else if (formData.loanType === 'monthly') {
      setFormData((prev) => ({ ...prev, tenure: 4 }));
    }
  }, [formData.loanType]);

  // Recalculate loan details whenever relevant fields change
  useEffect(() => {
    calculateLoanDetails();
  }, [formData.loanAmount, formData.tenure, calculateLoanDetails]);

  const validate = () => {
    let tempErrors = {};
    const parsedLoanAmount = parseFloat(formData.loanAmount);
    const parsedTenure = parseInt(formData.tenure);

    tempErrors.fullName = formData.fullName ? "" : "Full Name is required.";
    tempErrors.mobile = (/^[6-9]\d{9}$/.test(formData.mobile)) ? "" : "Valid 10-digit Indian Mobile Number is required.";
    tempErrors.loanAmount = (parsedLoanAmount > 0 && !isNaN(parsedLoanAmount)) ? "" : "Valid Loan Amount is required.";
    tempErrors.purpose = formData.purpose ? "" : "Loan Purpose is required.";
    tempErrors.loanType = formData.loanType ? "" : "Please select a loan type.";
    tempErrors.tenure = (parsedTenure > 0 && !isNaN(parsedTenure)) ? "" : "Valid Tenure is required.";
    tempErrors.address = formData.address ? "" : "Address is required.";

    setErrors({ ...tempErrors });
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (name === 'loanAmount' || name === 'tenure') {
      console.log(`handleChange - ${name}:`, value, `(parsed: ${parseFloat(value)})`);
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({ ...prev, address: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}` }));
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to retrieve your location. Please enter it manually.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services for your browser/device.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please try again later.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out. Please try again.";
              break;
            case error.UNKNOWN_ERROR:
              errorMessage = "An unknown error occurred while getting your location.";
              break;
            default:
              break;
          }
          alert(errorMessage);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter your address manually.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setSubmitMessage({ type: '', text: '' });
      try {
        console.log('handleSubmit - formData (before conversion):', formData);
        console.log('handleSubmit - parseFloat(formData.loanAmount):', parseFloat(formData.loanAmount));
        console.log('handleSubmit - parseInt(formData.tenure):', parseInt(formData.tenure));

        const dataToSend = {
          ...formData,
          loanAmount: parseFloat(formData.loanAmount), // Explicitly convert to number
          tenure: parseInt(formData.tenure), // Also ensure tenure is a number
        };
        console.log('handleSubmit - dataToSend (after conversion):', dataToSend);
        const response = await createApplication(dataToSend);
        setSubmitMessage({
          type: 'success',
          text: `Thanks, ${formData.fullName}! Your application (ID: ${response.data.applicationId}) has been received. We’ll message you on WhatsApp within 24–48 hours with next steps.`,
          applicationId: response.data.applicationId,
        });
        setFormData({ // Clear form
          fullName: '',
          mobile: '',
          isWhatsApp: true,
          email: '',
          loanAmount: '',
          purpose: '',
          loanType: 'weekly',
          tenure: 10,
          address: '',
          totalRepayable: 0,
          installment: 0,
        });
        window.scrollTo(0, 0); // Scroll to top to show message
      } catch (err) {
        console.error('Application submission error:', err.response?.data || err);
        setSubmitMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to submit application. Please try again.',
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center margin-bottom-large">
          <h1>Apply for a Loan</h1>
          <p>Fill out the form below to submit your loan application. Quick approval in 24-48 hours!</p>
        </div>

        <form onSubmit={handleSubmit} className="loan-application-form" noValidate>
          {submitMessage.text && (
            <div className={`alert ${submitMessage.type === 'success' ? 'alert-success' : 'alert-error'}`} role="alert">
              {submitMessage.text}
            </div>
          )}

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" required autocomplete="name" />
              {errors.fullName && <p className="error-text">{errors.fullName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className="form-control" required pattern="^[6-9]\d{9}$" autocomplete="tel" />
              {errors.mobile && <p className="error-text">{errors.mobile}</p>}
              <div className="checkbox-group">
                <input type="checkbox" id="isWhatsApp" name="isWhatsApp" checked={formData.isWhatsApp} onChange={handleChange} />
                <label htmlFor="isWhatsApp">WhatsApp is preferred</label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" autocomplete="email" />
            </div>

            <div className="form-group">
              <label htmlFor="loanAmount">Loan Amount Requested (₹)</label>
              <input type="number" id="loanAmount" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="form-control" required min="1" autocomplete="off" />
              {errors.loanAmount && <p className="error-text">{errors.loanAmount}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Loan Purpose</label>
              <select id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} className="form-control" required autocomplete="off">
                <option value="">Select Purpose</option>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
                <option value="Emergency">Emergency</option>
                <option value="Educational">Educational</option>
                <option value="Other">Other</option>
              </select>
              {errors.purpose && <p className="error-text">{errors.purpose}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="loanType">Loan Type</label>
              <select id="loanType" name="loanType" value={formData.loanType} onChange={handleChange} className="form-control" required autocomplete="off">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {errors.loanType && <p className="error-text">{errors.loanType}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="tenure">Tenure (in {formData.loanType === 'weekly' ? 'weeks' : 'months'})</label>
              <input type="number" id="tenure" name="tenure" value={formData.tenure} onChange={handleChange} className="form-control" required min="1" autocomplete="off" />
              {errors.tenure && <p className="error-text">{errors.tenure}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-control" required autocomplete="street-address" />
              <button type="button" onClick={handleGetLocation} className="btn btn-secondary btn-sm mt-2">Get Current Location</button>
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>

          </div>

          {formData.loanAmount > 0 && formData.tenure > 0 && (
            <div className="loan-summary-section">
              <h2>Loan Summary</h2>
              <p><strong>Interest Rate:</strong> {INTEREST_RATE_PER_PERIOD * 100}%</p>
              <p><strong>Total Repayable:</strong> ₹{formData.totalRepayable}</p>
              <p><strong>Installment ({formData.loanType === 'weekly' ? 'Weekly' : 'Monthly'}):</strong> ₹{formData.installment}</p>
            </div>
          )}

          <div className="text-center margin-top-large">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForLoan;