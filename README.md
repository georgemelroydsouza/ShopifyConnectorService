# Shopify / Sales Order Integration Service

Shopify Integration service is a NodeJs library for importing and fulfilling orders

## Details

a) Connects to the Shopify Account (details mentioned in the config file) and downloads all the new open orders. All downloaded orders are tagged as "TEST". Removal of this tag will re-download the order again.



## Usage


```
export NODE_ENV=default
node src/app.js
```

## License
@georgemelroydsouza