import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'What documents are required to apply for a loan?',
      answer: 'Typically, we require your Aadhaar card (front and back), PAN card, and a recent selfie. Additional documents may be requested based on the loan type.',
    },
    {
      question: 'How long does the loan approval process take?',
      answer: 'Our approval process is quick! You can expect a decision within 24-48 hours after submitting all required documents.',
    },
    {
      question: 'Are there any penalties for late repayment?',
      answer: 'Yes, late repayment may incur penalties as per our terms and conditions. We encourage timely payments to avoid additional charges.',
    },
    {
      question: 'Can I repay my loan early?',
      answer: 'Yes, you can repay your loan early. Please contact our support team to understand the process and any applicable terms.',
    },
    {
      question: 'What are the available payment modes for repayment?',
      answer: 'You can repay your loan weekly via cash, UPI, or direct bank transfer. Details will be provided upon loan disbursement.',
    },
    {
      question: 'What are the late fees?',
      answer: 'Late fees are applied as per the loan agreement. Please refer to your loan document or contact us for specific details.',
    },
    {
      question: 'What are the eligibility criteria for a loan?',
      answer: 'Eligibility criteria include being an Indian citizen, above 18 years of age, and having a stable source of income. Specific criteria may vary by loan product.',
    },
    {
      question: 'What is the maximum loan amount I can apply for?',
      answer: 'The maximum loan amount depends on the loan product and your eligibility. Please refer to our Services page or contact us for more details.',
    },
    {
      question: 'How do I repay my loan?',
      answer: 'You can repay your loan weekly through cash payments at our office, UPI transfers, or direct bank transfers. We will provide all necessary details.',
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can contact us via phone at +91 63841 02623, WhatsApp, or email at srikaruppanasamyfinance@gmail.com. Our office hours are Mo-Sa: 09:00 AM - 07:00 PM.',
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center margin-bottom-large">
          <h1>Frequently Asked Questions</h1>
          <p className="section-description">Find answers to the most common questions about our loan products and services.</p>
        </div>

        <div className="faq-section">
          {faqData.map((item, index) => (
            <div className="faq-item" key={index}>
              <div 
                className={`faq-question ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.question}</span>
                <span className="arrow-icon">{openIndex === index ? '▲' : '▼'}</span>
              </div>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FAQ;
