#!/bin/bash
awk '
/<link rel="stylesheet" href="css\/style.css">/{print "<style>"; while((getline l < "css/style.css")>0) print l; close("css/style.css"); print "</style>"; next}
/<script src="js\/i18n.js"><\/script>/{print "<script>"; while((getline m < "js/i18n.js")>0) print m; close("js/i18n.js"); print "</script>"; next}
/<script src="js\/main.js"><\/script>/{print "<script>"; while((getline n < "js/main.js")>0) print n; close("js/main.js"); print "</script>"; next}
{print}' index.html > alpina-demo.html
wc -c alpina-demo.html
