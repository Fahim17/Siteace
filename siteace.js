Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

if (Meteor.isClient) {
	//---------------subcribe
	//Meteor.subcribe('Websites');
	//------------routing---------------------------
	Router.configure({
		layoutTemplate: 'ApplicationLayout'
	});

//	Router.route('/', function () {
//		this.render('welcome', {to:"main"});
//	});

	Router.route('/', function () {
		this.render('navbar', {to: "navbar"});
	  this.render('website_form', {to: "form"});
		this.render('website_list', {to: "main"});
	});

	Router.route('/:siteName', function () {
		this.render('navbar', {to: "navbar"});
	  this.render('detail_page', {to: "main", data: function(){
	  		return Websites.findOne({title:this.params.siteName});
	  	}});
	});

	//----------------------------------------------
//accounts config
Accounts.ui.config({
		passwordSignupFields:"USERNAME_AND_EMAIL"
	});

	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort:{upVote:-1}});
		}
	});

	Template.detail_page.helpers({
		comments:function(){
			var website_id = this._id;
			return Comments.find({websiteID:website_id});
		}
	});



	/////
	// template events
	/////

//----------detail_page---------------------------------------------
		Template.detail_page.events({
			"click .js-submit-comment":function(event){
				var website_id = this._id;
				var commenter_name = Meteor.user().username;
				var Comment = document.getElementById("comment").value;
				console.log("Comment add by: " + commenter_name);

				Comments.insert({
					websiteID: website_id,
					NameOfCommenter: commenter_name,
					comment: Comment,
					commentAddedOn: new Date()
				});
				document.getElementById("comment").value="";
			}
		});
//-----------------------
	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			Websites.update({_id:website_id},{$inc:{upVote:1}});



			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);
			Websites.update({_id:website_id},{$inc:{downVote:1}});


			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},

		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var ttle = event.target.title.value;
			var descriptn = event.target.description.value;



			console.log("The url they entered is: "+url);
			console.log("title: "+ttle);
			console.log("dis:" +descriptn);
			if (url!="" && descriptn!="") {
				Websites.insert({
					title: ttle,
					url:url,
					description:descriptn,
					createdOn:new Date(),
					createdBy: Meteor.user()._id,
					upVote:0,
					downVote:0
				});
				Bert.alert( 'New Websites added', 'success', 'growl-top-right' );
			}else{
				Bert.alert( 'Enter all fields', 'warning', 'growl-top-right' );
			}
			event.target.url.value="";
			event.target.title.value="";
			event.target.description.value="";
			return false;// stop the form submit from reloading the page
		}
	});
}


if (Meteor.isServer) {
	//-----------security---------------------------------------------------
/*	Meteor.publish('Websites',function(){
		var currentUserId = this.userId;
		if (currentUserId!=null) {
			return Websites.find();
		}else{
			console.log("login first");
		}
	});
*/





	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date(),
				createdBy: "anonymous",
				upVote:0,
				downVote:0
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date(),
				createdBy: "anonymous",
				upVote:0,
				downVote:0
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date(),
				createdBy: "anonymous",
				upVote:0,
				downVote:0
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date(),
				createdBy: "anonymous",
				upVote:0,
				downVote:0
    	});
    }
  });
}
