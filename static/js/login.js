$("#loginBtn").click(function () {
	vex.dialog.open({
		message: "hello",
		buttons: [
			$.extend({}, vex.dialog.buttons.YES, {text: 'Login'}),
			$.extend({}, vex.dialog.buttons.NO, {text: 'Back'})
		]
	});
})