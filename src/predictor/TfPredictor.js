/**
 * @author syt123450 / https://github.com/syt123450
 * @author zchholmes / https://github.com/zchholmes
 */

import { Predictor } from "./Predictor";

/**
 * Handle prediction for tensorflow model.
 *
 * @param model, model context
 * @constructor
 */

function TfPredictor( model ) {

	// "TfPredictor" inherits from abstract predictor "Predictor".

	Predictor.call( this, model );

	/**
	 * list of output node names.
	 *
	 * @type { Array }
	 */

	this.outputsName = undefined;

	this.predictorType = "TfPredictor";

}

TfPredictor.prototype = Object.assign( Object.create( Predictor.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Predictor's abstract method
	 *
	 * TfPredictor overrides Predictor's function:
	 * predict
	 *
	 * ============
	 */

	/**
	 * predict(), Called by model to get prediction result.
	 *
	 * @param data, input data
	 * @param callback, callback function fired when finishing prediction.
	 */

	predict: function( data, callback ) {

		// Create input tensor for prediction.

		let inputTensor = this.createInputTensor( data );

		let predictResult;

		if ( this.outputsName !== undefined ) {

			// If has outputsName, use execute to get prediction result.

			predictResult = this.model.resource.execute( inputTensor, this.outputsName );

		} else {

			// If outputsName is undefined, use predict to get prediction result.

			predictResult = this.model.resource.predict( inputTensor );

		}

		// Execute callback function if defined.

		if ( callback !== undefined ) {

			callback( predictResult[ predictResult.length - 1 ].dataSync() );

		}

		return predictResult;

	},

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

	/**
	 * setOutputsName(), Store user's predefined outputsName list.
	 *
	 * @param names, { Array }, list of output node names.
	 */

	setOutputsName: function( names ) {

		this.outputsName = names;

	}

} );

export { TfPredictor };