import React from 'react';

const Blog = () => {
  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h2>Blog</h2>
      <p>Read our latest articles on financial tips and news.</p>
      
      <div style={{ marginTop: '50px' }}>
        <div>
          <h3>How to manage short-term loans</h3>
          <p>Short-term loans can be a great way to meet your immediate financial needs. However, it is important to manage them properly to avoid getting into a debt trap...</p>
          <a href="#">Read more</a>
        </div>
        <div style={{ marginTop: '30px' }}>
          <h3>Tips for small business finance</h3>
          <p>Managing finances is crucial for the success of any small business. Here are some tips to help you manage your finances effectively...</p>
          <a href="#">Read more</a>
        </div>
      </div>
    </div>
  );
};

export default Blog;