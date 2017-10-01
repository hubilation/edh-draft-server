import { expect } from "chai";
import {handleErrors} from "../src/dbUtilities";

describe("unique key error handling", ()=>{
    it("should extract the field that errored", ()=>{
        var errorMessage = "E11000 duplicate key error collection: draft.users index: userName_1 dup key: { : \"testuser\" }";

        var error = {
            message: errorMessage
        };
        
        var errorString = handleErrors(error)[0];
        
        expect(errorString).to.equal("An account with that userName already exists!");
    });
});