{
  "manifest_version": 2,
  "name": "g_rabbit",
  "description": "Helps you write and receive shorter emails",
  "version": "0.0.1",
  "content_scripts" : [
    {
      "matches": ["*://mail.google.com/mail/*"],
      "js": ["js/jquery.js", "js/compose.js"],
      "css": ["css/stylesheet.css"]
    }
  ]
}
