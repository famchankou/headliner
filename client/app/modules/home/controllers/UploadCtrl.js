(function () {
	'use strict';


	angular
		.module('headliner')
		.controller('uploadCtrl', uploadCtrl);

	uploadCtrl.$inject = ['Upload', '$scope'];

	function uploadCtrl(Upload, $scope) {
		/*jshint validthis: true */

        var form = this;
        form.newFilename = '';
        form.submit = submit;
        form.upload = upload;


        function submit(){
            if (form.upload_form.file.$valid && form.file) {
                form.upload(form.file);
            }
        }

        function upload(file) {
            Upload.upload({
                url: 'http://127.0.0.1:3000/upload',
                data: {file: file}
            }).then(function (resp) {
                if(resp.data.error_code === 0) {
                    form.newFilename = resp.data.new_filename;
                    $scope.$parent.imageLink = resp.data.new_filename;
                    console.log('A new image "' + resp.data.new_filename + '" has been uploaded.');
                } else {
                    console.log('An error occurred.');
                }
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                //console.log(evt);
            });
        }
    }
})();
