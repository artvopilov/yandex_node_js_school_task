var MyForm = {
    myForm: document.getElementById("myForm"),

    fio: this.myForm.fio,
    email: this.myForm.email,
    phone: this.myForm.phone,


    validate: function () {
        var isValid = true;
        var errorFields = [];

        var fioReg = /^[A-Za-zА-Яа-яёЁ]+\s+[A-Za-zА-Яа-яёЁ]+\s+[A-Za-zА-Яа-яёЁ]+$/;
        var emailReg = /^[a-zA-Z0-9][-_\.a-zA-Z0-9]+@(?:ya\.ru|yandex\.(?:ru|by|ua|kz|com))+$/;
        var phoneReg = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;

        if (!fioReg.test(this.fio.value.trim())) {
            isValid = false;
            errorFields.push(fio.name);
        }

        if (!emailReg.test(this.email.value)) {
            isValid = false;
            errorFields.push(email.name);
        }

        if (!phoneReg.test(this.phone.value)) {
            isValid = false;
            errorFields.push(phone.name);
        }
        else {
            var sum = +phone.value[1] + +phone.value[3] + +phone.value[4] + +phone.value[5] + +phone.value[7] +
                +phone.value[8] + +phone.value[9] + +phone.value[11] + +phone.value[12] + +phone.value[14] +
                +phone.value[15];
            if (sum > 30) {
                isValid = false;
                errorFields.push(phone.name);
            }
        }

        return {isValid: isValid, errorFields: errorFields};
    },

    getData: function () {
        return {
            fio:   this.fio.value,
            email: this.email.value,
            phone: this.phone.value};
    },

    setData: function (Object) {
        var nameArray = ["fio", "email", "phone"];

        nameArray.forEach(function (name, i, array) {
            if (name in (Object)) {
                this[name].value = Object[name];
            }
        }, this);
    },

    submit: function () {
        this.myForm.fio.classList.remove("error");
        this.myForm.fio.classList.add("ok");
        this.myForm.email.classList.remove("error");
        this.myForm.email.classList.add("ok");
        this.myForm.phone.classList.remove("error");
        this.myForm.phone.classList.add("ok");

        var resValidation = this.validate();
        if (!resValidation.isValid) {
            resValidation.errorFields.forEach(function (name, i, array) {
                if (this[name].classList.contains("ok")) {
                    this[name].classList.remove("ok");
                    this[name].classList.add("error");
                }
            }, this);

            return;
        }

        var postData = new FormData(this.myForm);
        var btn = document.getElementById("submitButton");
        btn.disabled = true;

        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();

        xhr.open('POST', this.myForm.action, true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status !== 200) {
                alert('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
                return;
            }

            var responseServer = JSON.parse(xhr.responseText);
            var resContainer = document.getElementById("resultContainer");

            resContainer.classList.remove("success", "progress", "error");

            if (responseServer.status === "progress") {
                resContainer.classList.add(responseServer.status);
                resContainer.innerHTML = "Progress";
                setTimeout(function() {
                    xhr.open('POST', MyForm.myForm.action, true);
                    xhr.send(postData);
                }, responseServer.timeout, postData);
            }
            else if (responseServer.status === "success") {
                resContainer.classList.add(responseServer.status);
                resContainer.innerHTML = "Success";
            }
            else if (responseServer.status === "error") {
                resContainer.classList.add(responseServer.status);
                resContainer.innerHTML = responseServer.reason;
            }
        };

        xhr.send(postData);
    }
};


MyForm.myForm.addEventListener("submit", function(event) {
    event.preventDefault();
    MyForm.submit();
});
