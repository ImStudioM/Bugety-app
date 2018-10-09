   

/* -------------------------------------------------------
 *     All calculation
 * ------------------------------------------------------ */

var calculateBudget = (function (){
    
    
   // functions constructors
   var Income = function(id, desc , val){
       
        this.id     = id;
        this.desc   = desc;
        this.val    = val;
    };   
    
    var Expense = function(id, desc , val){
        
        this.id     = id;
        this.desc   = desc;
        this.val    = val;
    };
    
    
    // All new objects stored here
    var data = {
        
        allData : {
          inc   :[],
          exp   :[]
        },
        
        totals  : {
          inc   :0,
          exp   :0 
        },
        budget  :0,
        precent :0
    };
    
    
    // All items calculation
    var calculateItems = function (type){
            
            var total = 0;
            data.allData[type].forEach(function(item){
               total += item.val;
            });
        
            data.totals[type] = total;
      
        };
    
 
    
    
    
    return {
        
        
   
        
        data,
        
        
        
        
        // Push new itemes to ata.allData[type]
        addItem: function(type, description, value) {
            
            var newItem, id;

            // Set new id based on the last no. in the arr.id
            if ( data.allData[type].length > 0 ) {
                // *example* // data.allData.inc[data.allData.inc.length - 1].id +1 
                id = data.allData[type][data.allData[type].length - 1 ].id + 1;   
            } else {   
                id = 0;   
            }

            // create a new item 
            if (type === 'inc'){
                var newItem = new Income (id,description,value);
            } else if (type === 'exp'){  
                var newItem = new Expense(id,description,value);
            }
            // push the item into the arr data.allData
            data.allData[type].push(newItem);
            
            return newItem;
 
         },
        
        
        
        
        
        // calculate / data.budget / data.precent /data.totals
        calculateBudget : function (){
            
            // calculate items
            calculateItems('exp');
            calculateItems('inc');
            
            // clculate budget
            data.budget = data.totals.inc - data.totals.exp;
 
            // calculate percentage
            
            if (data.totals.exp < 1 && data.totals.exp === 0 ||  data.totals.inc < 1 && data.totals.inc === 0 || data.budget < 1) {
                
                data.precent = 0;
                
            } else {
                
                data.precent = (parseFloat( (data.totals.exp / data.totals.inc).toFixed(3) ))*100  ;
                
            }
            

        },
        
        
        // Return the budget totals
        getBudget : function() {
            return {
                totalExp    :data.totals.exp,
                totalInc    :data.totals.inc,
                buget       :data.budget,
                percentage  :data.precent
            };
        },
        
        
        
        

        // Delete items from data.allData[type]
        deleteItems : function (type, id) {
            
            var ids, index;
            
            // Get id & return array // arr.id = [2, 4, 9] // ids = [0, 1, 3] 
            ids = data.allData[type].map(function(curr){
                return curr.id;
            });
            
            // index = to the selction index no. 
            index = ids.indexOf(id);
            
            // Delet the item form the array
            data.allData[type].splice(index, 1);
         }
 
    };

// calculateBudget ends     
})();






/* -------------------------------------------------------
 *     DOM monipaltion / Taking info from the DOM
 * ------------------------------------------------------ */

var UIBudget = (function (){
    
    
    
    
    var DOMstings = {
        
    // Buttons
    caluletBTN  : $('.add__btn'),
    removeBTN   : $('.item__delete--btn'),
    section     : $('.expenses__list, .income__list'),
    //item        : $(this).closest('.item'),    
        
    // Input values
    inputType    : $('.add__type'),
    inputDesc    : $('.add__description'),
    inputVal     : $('.add__value'),
        
    // The part to the incList / expList item
    incList      : $('.income__list'),
    expList      : $('.expenses__list'),
        
    // Budget
    theBudget    : $('.budget__value'),    
    budgetIcom   : $('.budget__income--value'),
    budgetExpens : $('.budget__expenses--value'),
    percentage   : $('.budget__expenses--percentage')

    };    
    
    
    
    
    
    
    
    
    return {
        
        
        
        
        DOMstings,
        
   
        
        
        // Get Info from fields
        getInfo       : function(){
            return {
                
                addType  : DOMstings.inputType.val(),
                addDesc  : DOMstings.inputDesc.val(),
                addVal   : parseFloat(DOMstings.inputVal.val())
            };
        },
        
        
        
        
        
        
        
        
        // clear fields
        clearFields   : function(){
            
                //DOMstings.inputType.val("income");
                DOMstings.inputDesc.val('');
                DOMstings.inputVal.val('');
        },
        
        
 
        
        
        
        addItemList   : function (obj, type){
            
            
            // Create the html
            
            var html, newHtml, elemaent;
            
            if (type === 'inc'){
                
                elemaent = DOMstings.incList;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">+ %val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
                
            } else if (type === 'exp'){
                
                elemaent = DOMstings.expList;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- %val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ; 
                
            }
            
            // Replace the in the HTML we want 
            
            newHtml  = html.replace('%id%', obj.id);
            newHtml  = newHtml.replace('%desc%', obj.desc);
            newHtml  = newHtml.replace('%val%', obj.val);
        
            // Add it to the ui
            
            $(newHtml).hide().appendTo(elemaent).fadeIn(500);
            //elemaent.append(newHtml);  
        },
        
        
        
        
        
        
        updadeTheBuget : function (){
            
            var buget = calculateBudget.getBudget();
            
            DOMstings.theBudget.text('₪ ' + buget.buget);
            DOMstings.budgetIcom.text('+ ' + buget.totalInc);
            DOMstings.budgetExpens.text('- ' + buget.totalExp);
            DOMstings.percentage.text(buget.percentage + '%');
        }
    };

// UIBudget ends  
})();










/* -------------------------------------------------------
 *     All events
 * ------------------------------------------------------ */

var events = (function (UI ,calc){
    
    
    
    
    // == update budget function ==
     var updateBudget = function (){
         
         // 1. Calculate budget
         calc.calculateBudget();
         
         // 2. Return the budget
         var budget = calc.getBudget();
 
         // 3. Show it on the UI
         UI.updadeTheBuget();
     }
     
     
     
     
    
   
    // == Add item function == 
    function addBudget (){
        
        //1. Take the info from fields
        var input = UI.getInfo();
        
        if ( input.addVal > 0 && !isNaN(input.addVal) &&input.addDesc != '') {  
            
            //2. Add the data to data structures
            var budgetData = calc.addItem( input.addType, input.addDesc, input.addVal );

            //2.5.clear the fields
            UI.clearFields();
        
            //3. Show the dada on the app ui
            UI.addItemList( budgetData, input.addType);
        
            //4. Calculate the data
            //5. Show the summary on the budget
            updateBudget();

        }  
    }
    
    
    
    // == DELETE function ==
    function deleteBudget () {

        //2. Delelt the itme from the data Arr
        
        var ids, id ,type;
        ids   = $(this).closest('.item')[0].id.split('-');
        type  = ids[0];
        id    = parseFloat(ids[1]);

        calc.deleteItems(type, id);
   
        //3. update the UI
        $(this).closest('.item').fadeOut(300, function(){ $(this).remove();});
    
        //4. calculate the Budget
        updateBudget();
        
        
    };
    
    
    


    // button add item Event
    UI.DOMstings.caluletBTN.on('click',addBudget);
    
    // Key Event (Enter)
    $(document).keypress(function(keyp){
        if (keyp.key === 'Enter'){
            addBudget();
        }
    });
    

    
    
    // button DELETE item Event
       //1. add event butuon to delete item
    UI.DOMstings.section.on('click','.item__delete--btn', deleteBudget);
    
    

// events ends      
})(UIBudget, calculateBudget);





    






