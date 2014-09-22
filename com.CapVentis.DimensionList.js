
var _app;

define( ["jquery", "qlik"], function ( $, qlik ) {
	'use strict';

	_app=qlik.currApp();
	
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 20,
					qHeight: 1
				}]
			}
		},
		//property panel
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 2,
					max: 20
					
				},
				variable: {
					type: "items",
					label: "Variable",
					items:{
						VariableName: {
							type: "string",
							label: "List Variable Name",
							ref: "variable.variablename",
							defaultValue: "vDimensionList"
						}
					}
					
				},
				/* measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},*/
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {

			var self = this, html = '<table width="100%">';
			var dimensions = layout.qHyperCube.qDimensionInfo;
			
			
			var vVariableValue='Test value';
			var varName=layout.variable.variablename;

			_app.variable.create(varName);
			
			_app.variable.getContent(varName, function(varContent) { 
				
				var vCurrentSelected = ''+varContent.qContent.qString;

				if ( dimensions && dimensions.length > 0 ) {
				
					if(vCurrentSelected.trim()=='')
					{
						vCurrentSelected=dimensions[0].qGroupFieldDefs;
						//console.info('Setting initial: ' + dimensions[0].qGroupFieldDefs);
						selectDimension(dimensions[0].qFallbackTitle, dimensions[0].qGroupFieldDefs, varName);
					}
				
					for(var dim in dimensions) {
						var vBGColor=dimensions[dim].qGroupFieldDefs==vCurrentSelected ? '#00ff00' : '#ffffff';
							
						html += '<tr><td style="background-color: '+ vBGColor +'" onclick="selectDimension(\'' + dimensions[dim].qFallbackTitle + '\', \'' + dimensions[dim].qGroupFieldDefs + '\', \'' + varName + '\')">';
						html += dimensions[dim].qFallbackTitle;
						html += "</td></tr>";
						
					} 
				}
				html += "</table>";
				$element.html( html );


			} );
			
			
		}
	};

} );

function selectDimension(dimText, dimName, varName)
{
	//console.info('Setting ' + varName + ' to ' + dimName);
	if(varName)
		_app.variable.setContent(varName, dimName);
	
	console.info('Clear cells and set '+ dimText +' to Green');
	$("td").css('background-color', '#ffffff');

	$("td").filter(function() {
		return $(this).text() == dimText;
	}).css('background-color', '#00ff00');
}



