(function () {
	'use strict';

	var modal = document.getElementById('learning-modal');
	if (!modal) return;

	var form = modal.querySelector('form');
	var course = document.getElementById('learning-course');
	var fields = Array.from(form.querySelectorAll('input, select, textarea'));
	var opener = null;
	var backdropPress = false;

	function outsideDialog(event) {
		var bounds = modal.getBoundingClientRect();
		return event.clientX < bounds.left || event.clientX > bounds.right ||
			event.clientY < bounds.top || event.clientY > bounds.bottom;
	}

	function validateField(field) {
		field.setCustomValidity('');
		if (!field.value.trim()) {
			field.setCustomValidity(field.dataset.requiredMessage);
		} else if (field.validity.typeMismatch) {
			field.setCustomValidity('Введіть коректну адресу електронної пошти.');
		} else if (field.minLength > 0 && field.value.trim().length < field.minLength) {
			field.setCustomValidity('Введіть щонайменше ' + field.minLength + ' символів.');
		}
	}

	fields.forEach(function (field) {
		field.addEventListener('input', function () {
			validateField(field);
		});
	});

	document.querySelectorAll('[data-learning-modal-open]').forEach(function (trigger) {
		trigger.addEventListener('click', function (event) {
			event.preventDefault();
			if (modal.open) return;
			opener = trigger;
			var selectedCourse = trigger.dataset.learningCourse;
			if (selectedCourse) course.value = selectedCourse;
			modal.showModal();
			document.body.classList.add('learning-modal-open');
		});
	});

	modal.querySelectorAll('[data-learning-modal-close]').forEach(function (button) {
		button.addEventListener('click', function () {
			modal.close();
		});
	});

	modal.addEventListener('pointerdown', function (event) {
		backdropPress = event.target === modal && outsideDialog(event);
	});

	modal.addEventListener('click', function (event) {
		if (backdropPress && event.target === modal && outsideDialog(event)) {
			modal.close();
		}
		backdropPress = false;
	});

	modal.addEventListener('close', function () {
		document.body.classList.remove('learning-modal-open');
		backdropPress = false;
		if (opener && opener.isConnected) opener.focus();
	});

	form.addEventListener('submit', function (event) {
		event.preventDefault();
		fields.forEach(validateField);
		if (form.reportValidity()) {
			modal.close();
		}
	});
	form.noValidate = true;
}());
