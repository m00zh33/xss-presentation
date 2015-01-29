//TODO: refactor AJAX code
(function () {
    $(document).ready(function () {
        $("#entry-form").submit(function () {
            $.ajax("/service/entries/", {
                method: "POST",
                data: {
                    content: $("#entry-form-text").val()
                },
                success: function () {
                    loadUserState();
                    refresh();
                    $("#entry-form-text").val("");
                }
            });
            return false;
        });

        $("#delete-all-button").click(function () {
            deleteAllEntries();
            return false;
        });

        $("#login-form").submit(function () {
            login();
            return false;
        });

        $("#filter-form").submit(function(keyCode){
            return false;
        });

        $("#filter-text").keyup(function(){
            refresh();
        });

        refresh();
        loadUserState();
    });

    function deleteAllEntries() {
        $.ajax("/service/deleteEntries/", {
            method: "POST"
        }).success(function () {
            refresh();
        }).fail(function (ajax, state, errorMessage) {
            alert("TODO: display error dialog.");
        });
    }

    function refresh() {
        $.ajax("/service/entries", {
            contentType: "json",
            data: {filter: $("#filter-text").val()}
        }).success(function (entries, result, xhr) {
            $("#entries").html("");
            entries.found.map(function (entry) {
                $("#entries").append("<div class='entry'>" + entry.contents + "</div>");
            });
        });
    }

    function loadUserState() {
        $.ajax("/service/userState", {
            contentType: "json"
        }).success(function (user, result, xhr) {
            initUI(user)
        });
    }

    function initUI(userState) {
        var loggedIn = userState['loggedIn'];
        $("#delete-all-form").css("display", loggedIn ? "block" : "none");
        $("#login-form").css("display", loggedIn ? "none" : "block");
    }

    function login() {
        $.ajax("/service/login", {
            method: "POST",
            data: {
                username: $("#username-text").val(),
                password: $("#password-text").val()
            }
        }).success(function (user, result, xhr) {
            initUI(user);
        }).fail(function (ajax, state, errorMessage) {
            alert("TODO: display error dialog.");
        });
    }

}());