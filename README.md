# LN Merchant Finder

A full-stack web application providing merchants accepting lightning to list their businesses, and for those wishing to support businesses accepting the most advanced form of money ever discovered to find and learn more about them.

Given the monetary properties provided by bitcoin, businesses accepting ln (or on-chain txs) are incentivised to offer a discount to those leveraging the network and to incentivise consumers to part with their precious sats.

The app provides a search function once users are logged in to find bussiness, add, edit or remove listings and learn more about merchants.

---

### Technologies used: 

Node.js, Express, MongoDB, Mongoose, Javascript, EJS, Bootstrap


---

### Approach:
My approach was to create a mobile first app focussed around search. I made a strong effort to encorporate login via lightning but was unable to get it working so left the legacy login enabled. 
The app adheres to the RESTful conventions and utilised all 7 routes, as well as MVC structure. The app is reployed on heroku here: https://ln-merchant-finder.herokuapp.com/