/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Loader } from './Loader';
import { TfPredictor } from "../predictor/TfPredictor";

/**
 * Load tensorflow model for TensorSpace.
 *
 * @param model, model context
 * @param config, user's configuration for Loader
 * @constructor
 */

function TfLoader( model, config ) {

	// "TfLoader" inherits from abstract Loader "Loader".

	Loader.call( this, model, config );

	/**
	 * tensorflow model's url (.pb file's url).
	 * Important parameter for TfLoader to get tensorflow model.
	 *
	 * @type { url }
	 */

	this.modelUrl = undefined;

	/**
	 * tensorflow weight's url (.json file's url).
	 * Important parameter for TfLoader to get tensorflow model.
	 *
	 * @type { url }
	 */

	this.weightUrl = undefined;

	/**
	 * User's predefined outputsName list.
	 * If set, TfLoader will set this name list to TfPredictor.
	 *
	 * @type { Array }
	 */

	this.outputsName = undefined;

	// Load TfLoader's configuration.

	this.loadTfConfig( config );

	this.loaderType = "TfLoader";

}

TfLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Loader's abstract method
	 *
	 * TfLoader overrides Loader's function:
	 * load, setPredictor
	 *
	 * ============
	 */

	/**
	 * load(), load tensorflow model asynchronously.
	 *
	 * Three steps:
	 * 1. Load tensorflow model into TSP
	 * 2. Set tensorflow predictor to TSP
	 * 3. Fire callback function if defined.
	 *
	 * @returns { Promise.<void> }
	 */

	load: async function() {

		const loadedModel = await tf.loadFrozenModel( this.modelUrl, this.weightUrl );

		this.model.resource = loadedModel;
		this.model.modelType = "tensorflow";

		this.setPredictor();

		if ( this.onCompleteCallback !== undefined ) {

			this.onCompleteCallback();

		}

	},

	/**
	 * setPredictor(), create a tensorflow predictor, config it and set the predictor for TSP model.
	 */

	setPredictor: function() {

		let tfPredictor = new TfPredictor( this.model );
		tfPredictor.setOutputsName( this.outputsName );

		this.configInputShape( tfPredictor );

		this.model.predictor = tfPredictor;

	},

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadTfConfig(), Load user's configuration into TfLoader.
	 * The configuration load in this function sometimes has not been loaded in "Loader"'s "loadLoaderConfig".
	 *
	 * @param loaderConfig
	 */

	loadTfConfig: function( loaderConfig ) {

		// "modelUrl" configuration is required.

		if ( loaderConfig.modelUrl !== undefined ) {

			this.modelUrl = loaderConfig.modelUrl;

		} else {

			console.error( "\"modelUrl\" property is required to load tensorflow model." );

		}

		// "weightUrl" configuration is required.

		if ( loaderConfig.weightUrl !== undefined ) {

			this.weightUrl = loaderConfig.weightUrl;

		} else {

			console.error( "\"weightUrl\" property is required to load tensorflow model." );

		}

		// Optional configuration.

		if ( loaderConfig.outputsName !== undefined ) {

			this.outputsName = loaderConfig.outputsName;

		}

	}

} );

export { TfLoader };