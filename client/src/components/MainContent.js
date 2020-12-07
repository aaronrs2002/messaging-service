import React, { useState, useEffect } from "react";

const MainContent = () => {
return (        
<React.Fragment>
<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
  <h1 className="display-4">Login Template</h1>
  <p className="lead">A re-usable template for future projects using React.js, Node.js, MySQL. A special thanks to <a href="https://bootswatch.com/" target="_blank">bootswatch.com</a>, which is where all the themes are created. This is the start of any project. The login functionality is taken care of.</p>
</div>


<div className="card-deck mb-3 text-center">
<div className="card mb-4 shadow-sm">
  <div className="card-header">
    <h4 className="my-0 font-weight-normal">Free</h4>
  </div>
  <div className="card-body">
    <h1 className="card-title pricing-card-title">$0 <small className="text-muted">/ mo</small></h1>
    <ul className="list-unstyled mt-3 mb-4">
      <li>10 users included</li>
      <li>2 GB of storage</li>
      <li>Email support</li>
      <li>Help center access</li>
    </ul>
    <button type="button" className="btn btn-lg btn-block btn-outline-primary">Sign up for free</button>
  </div>
</div>
<div className="card mb-4 shadow-sm">
  <div className="card-header">
    <h4 className="my-0 font-weight-normal">Pro</h4>
  </div>
  <div className="card-body">
    <h1 className="card-title pricing-card-title">$15 <small className="text-muted">/ mo</small></h1>
    <ul className="list-unstyled mt-3 mb-4">
      <li>20 users included</li>
      <li>10 GB of storage</li>
      <li>Priority email support</li>
      <li>Help center access</li>
    </ul>
    <button type="button" className="btn btn-lg btn-block btn-primary">Get started</button>
  </div>
</div>
<div className="card mb-4 shadow-sm">
  <div className="card-header">
    <h4 className="my-0 font-weight-normal">Enterprise</h4>
  </div>
  <div className="card-body">
    <h1 className="card-title pricing-card-title">$29 <small className="text-muted">/ mo</small></h1>
    <ul className="list-unstyled mt-3 mb-4">
      <li>30 users included</li>
      <li>15 GB of storage</li>
      <li>Phone and email support</li>
      <li>Help center access</li>
    </ul>
    <button type="button" className="btn btn-lg btn-block btn-primary">Contact us</button>
  </div>
</div>
</div>
</React.Fragment>)
}

export default MainContent