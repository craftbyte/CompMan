module.exports={
	"databaseUrl":"mongodb://localhost/megavet",
	"auth": {
		"saml":true,
		"local":true
	},
	"saml":{
		"url":"https://idp.sc-nm.si/simplesaml/saml2/idp/SSOService.php",
		"entityName":"megavet"
	}

}