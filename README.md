vorkNode
========

vorkNode by Bradley Matusiak       

    bmatusiak@ gmail.com
    
## Installation and Usage

Requirements:

  * NodeJS `>= 0.6.15`
  * NPM `>= 1.1.16`

Install:

     get clone git://github.com/bmatusiak/vorkNode.git
     cd vorkNode
     npm install
    
## License

The GPL version 3, read it at [http://www.gnu.org/licenses/gpl.txt](http://www.gnu.org/licenses/gpl.txt)

----------

# How it works

OK so my modified NoobHTTP is what is providing HTTP Server for static files
when the server gets a 404 error is directs the request to vork.mvc(req, res)

these are the steps it takes to produce output from vorkNode

`
1.Construct URL to mvc params
`

* so lets say the url is /home/login
* controler = home
* controler.action = login

`
2.Call Controler
`

* the return data will be sent to view(most likely a object(s))
* this can be absent if view is present

`
3.Call View
`

* the view that gets call will have the same name as controler unless controler
* the return data will be sent to layout(This will be a string)

`
4.Call Layout
`

* this is the last object that gets called
* if controler say layout = null then only view is output
* default layout is mvc/layout/default.js

## Objects Info

### Config

    var configDefaults = {
          basepath: __dirname,
          DEBUG: false,
          modelsFolder:'/models',
          viewsFolder:'/views',
          elementsFolder:'/elements',
          controlersFolder:'/controlers',
          layoutsFoler:'/layouts',
          webrootFolder:'../webroot',
          helpersFolder:'/helpers',
          DS:'/',
          EOL:'\r\n',
          dbConfig: __dirname+'/db.js',
          port:Number(process.env.PORT || 80),
          globals: {}
     };
Any of the defaults can be sent on vork construct

### VorkArgument

* vork
    * get `return values are exports`
        * helper
        * element `only works in controler`
        * model `only works in controler` `vork.mvc.db is only available here`
    * mvc `defaults` (Null values are object passed in order in witch it came)
        * controler: null
        * layout: 'default'
        * action: 'index'
        * view: null
        * params: []
        * contentType: 'text/html'
        * db: null `only present in vork.get.model`
    * config `readonly`








