const fs = require('fs');
const path = require('path');
const convertCsv2Json = require('../index');

const describe = require('mocha').describe;
const it = require('mocha').it;
const before = require('mocha').before;
const after = require('mocha').after;
const expect = require('chai').expect;

describe("convert csv to json", function () {
    describe('check whether the input csv file exists', () => {

        let not_exist_file = path.join(__dirname, 'resources', 'hello.csv');
        let result_folder = path.join(__dirname, 'resources');

        it('if not exists, error should be passed into callback', () => {
            convertCsv2Json(not_exist_file, result_folder, (error) => {
                expect(error).exist;
            })
        });

        // it('if not exists, error should be throw when callback is not provided', () => {
        //     expect(() => convertCsv2Json(not_exist_file, result_folder)).to.throw();
        //     // expect(() => ).to.throw(Error);
        // });

    });

    describe('The input csv file is resources/customer-data.csv', () => {
        let csv_file = path.join(__dirname, 'resources/customer-data.csv');
        let json_file = path.join(__dirname, 'resources/data.json');
        let not_exist_folder = path.join(__dirname, 'out/data.json');
        let error_csv_file = path.join(__dirname, 'resources/customer-data-error.csv');
        let expected_json_file = path.join(__dirname, 'resources/customer-data-solution.json');
        let expected_json = null;
        before(() => {
            expected_json = JSON.parse(fs.readFileSync(expected_json_file));
        });

        it('should pass json data into the callback', () => {

            convertCsv2Json(csv_file, null, (error, data) => {
                expect(error).to.be.null;
                expect(data).to.not.null;
                expect(data).to.be.lengthOf(expected_json.length);

                expect(data).to.have.deep.members(expected_json);

            });

        });


        it('should write the result into the json file: resources/data.json', () => {
            convertCsv2Json(csv_file, json_file, (error, data) => {
                expect(data).to.not.null;
                expect(data).to.eq('done');

                fs.exists(json_file, (is_exists) => {
                    expect(is_exists).to.be.true;
                });
            });

        });


        it('should check whether the folder where the output json file will reside in exists', () => {

            convertCsv2Json(csv_file, not_exist_folder, (error, data) => {
                expect(error).to.not.null;

            });

        });


        it('should ensure the content of csv is valid', () => {
           convertCsv2Json(json_file, error_csv_file, (error, data) => {
               expect(error).to.not.null;
           });
        });

       

        after(() => {
            fs.unlinkSync(json_file);
        });


    });




});