# NitroClient-ModernUI

Never pay Corlel because it is shit like he is. I do not recommend to use this because it is very bad.

Credits to Bill for Nitro.

# Info

To change the articles in the hotel view, please open the **ExternalTexts.json** and customize the articles by adding the codes below.

    "hotel.view.header.1": "header text 1",
    "hotel.view.header.2": "header text 2",
    "hotel.view.header.3": "header text 3",
    "hotel.view.header.4": "header text 4",
    "hotel.view.description.1": "description text 1",
    "hotel.view.description.2": "description text 2",
    "hotel.view.description.3": "description text 3",
    "hotel.view.description.4": "description text 4",
    "hotel.view.button.1": "button text 1",
    "hotel.view.button.2": "button text 2",
    "hotel.view.button.3": "button text 3",
    "hotel.view.button.4": "button text 4",
    "hotel.view.link.1": "your_link",
    "hotel.view.link.2": "your_link",
    "hotel.view.link.3": "your_link",
    "hotel.view.link.4": "your_link"

Please replace the hotel-view section on line 40 in your configuration file with this.

    "hotelview.images": {
        "background": "${asset.url}/images/reception/easter20_background_gradient.png",
        "background.colour": "#6eadc8",
        "sun": "${asset.url}/images/reception/sun.png",
        "drape": "${asset.url}/images/reception/drape.png",
        "left": "${asset.url}/images/reception/easter20_background_left.png",
        "right": "${asset.url}/images/reception/background_right_easter2016.png",
        "right.repeat": "${asset.url}/images/reception/us_top_right.png",
        "carousel1": "${asset.url}/images/reception/spromo1.png",
        "carousel2": "${asset.url}/images/reception/spromo2.png",
        "carousel3": "${asset.url}/images/reception/spromo3.png",
        "carousel4": "${asset.url}/images/reception/spromo4.png"
    },
    
Please add these codes at the bottom of the configuration file.

    "modernuipower": {
        "domainIsWrong": ""
    },
    "nitrohotel": {
        "navigator": ""
    }
