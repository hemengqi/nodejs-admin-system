/*创建angular对象*/
var myApp = angular.module('myApp', ['ng-admin']);
/*设置对象*/
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    /*创建后台主对象*/
    var admin = nga.application()
        .debug(true)
        /*设置头部*/
        .header('<div class="navbar-header">' +
                '<a class="navbar-brand" href="#" ng-click="appController.displayHome()">树愿</a>' +
            '</div>' +
            '<p class="navbar-text navbar-right">' +
                '<a href="/logout">' +
                    '<span class="glyphicon glyphicon-share-alt"></span>登出' +
                '</a>' +
            '</p>')
        /*设置API接口url*/
        .baseApiUrl('http://jsonplaceholder.typicode.com/'); 
    /*创建实体*/
    // ajax接口为'http://jsonplaceholder.typicode.com/users/:id
    var user = nga.entity('users');
    var post = nga.entity('posts');
    var comment = nga.entity('comments');

    /*设置实体列表视图*/
    user.listView()
        .title('用户列表')//列表名称
        .perPage(20)//每页信息条数
        .sortField('name')//排序依据
        .sortDir('ASC')//排序规则
        .fields([//信息列表，为返回对象的键名
            nga.field('name').label('用户名'),
            nga.field('username').label('昵称'),
            nga.field('email').label('电子邮箱')
        ])
        .listActions(['edit','delete'])//列表操作
        .batchActions([])
        .filters([//搜索
            nga.field('q')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="搜索" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
        ]);
    user.creationView().fields([
        nga.field('name')
            .validation({ required: true, minlength: 3, maxlength: 100 }),
        nga.field('username')
            .attributes({ placeholder: 'No space allowed, 5 chars min' })
            .validation({ required: true, pattern: '[A-Za-z0-9\.\-_]{5,20}' }),
        nga.field('email', 'email')
            .validation({ required: true }),
        nga.field('address.street').label('Street'),
        nga.field('address.city').label('City'),
        nga.field('address.zipcode').label('Zipcode')
            .validation({ pattern: '[A-Z\-0-9]{5,10}' }),
        nga.field('phone'),
        nga.field('website')
            .validation({ validator: function(value) {
                if (value&&value.indexOf('http://') !== 0) throw new Error ('Invalid url in website');
            } })
    ]);
    // use the same fields for the editionView as for the creationView
    user.editionView().fields(user.creationView().fields())
                        .title('Edit item "{{ entry.values.name }}"')
                        .description('Edit the information here')
                        .actions(['show','back','create']);

    //post.readOnly();
    
    post.listView()
        .fields([
            nga.field('title'),
            nga.field('body', 'text')
                .map(truncate),
            nga.field('userId', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('Author')
        ])
        .listActions(['edit','delete'])
        //.batchActions([])
        .filters([
            nga.field('q')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="搜索" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('userId', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('User')
                .attributes({ placeholder: 'user' })
        ]);
    post.showView().fields([
	    nga.field('title'),
	    nga.field('body', 'text'),
	    nga.field('userId', 'reference')
	        .targetEntity(user)
	        .targetField(nga.field('username'))
	        .label('User'),
	    nga.field('comments', 'referenced_list')
	        .targetEntity(nga.entity('comments'))
	        .targetReferenceField('postId')
	        .targetFields([
	            nga.field('email'),
	            nga.field('name')
	        ])
	        .sortField('id')
	        .sortDir('DESC'), 
        nga.field('currency', 'choice')
            .choices([
              { value: 'USD', label: 'dollar ($)' },
              { value: 'EUR', label: 'euro (€)' },
            ]),
        nga.field('power_user', 'boolean')
            .choices([
                { value: null, label: 'not yet decided' },
                { value: true, label: 'enabled' },
                { value: false, label: 'disabled' }
            ]),
        nga.field('picture', 'file').uploadInformation({ 'url': 'http://127.0.0.1/my-first-admin/', 'apifilename': 'picture_name' }),
        nga.field('custom_action')
            .label('')
            .template('<send-email post="entry"></send-email>')
	]);
    post.editionView().fields(post.showView().fields())
                        .title('Edit item "{{ entry.values.title}}"')
                        .description('Edit the post here')
                        .actions(['back','create']);

    // add the entity to the admin application
    admin.addEntity(user);
    admin.addEntity(post);
    /*侧栏菜单配置*/
    admin.menu(nga.menu()
        .addChild(nga.menu().title('用户管理').icon('<span class="glyphicon glyphicon-user"></span>').active(function(path){
                return path.indexOf('/user') === 0;
            })
            .addChild(nga.menu().title('用户列表').link('users/list').icon('<span class="glyphicon glyphicon-th"></span>'))
            .addChild(nga.menu().title('申请提现').icon('<span class="glyphicon glyphicon-jpy"></span>'))
            )
        .addChild(nga.menu().title('文章管理').icon('<span class="glyphicon glyphicon-pencil"></span>').active(function(path){
                return path.indexOf('/post') === 0;
            })
            .addChild(nga.menu().title('所有文章').link('posts/list').icon('<span class="glyphicon glyphicon-file"></span>'))
            .addChild(nga.menu().title('所有评论').link('comments/list').icon('<span class="glyphicon glyphicon-comment"></span>'))
        )
        .addChild(nga.menu().title('测试'))
    );
    /*首页控制面板配置*/
    admin.dashboard(nga.dashboard()
        .addCollection(nga.collection(post)
            .name('recent_posts')
            .title('Recent posts')
            .perPage(5) // limit the panel to the 5 latest posts
            .fields([
                nga.field('published_at', 'date').label('Published').format('MMM d'),
                nga.field('title').isDetailLink(true).map(truncate),
                nga.field('views', 'number')
            ])
            .sortField('published_at')
            .sortDir('DESC')
            .order(1)
        )
        .addCollection(nga.collection(post)
            .name('popular_posts')
            .title('Popular posts')
            .perPage(5) // limit the panel to the 5 latest posts
            .fields([
                nga.field('published_at', 'date').label('Published').format('MMM d'),
                nga.field('title').isDetailLink(true).map(truncate),
                nga.field('views', 'number')
            ])
            .sortField('views')
            .sortDir('DESC')
            .order(3)
        )
        .addCollection(nga.collection(comment)
            .title('Last comments')
            .perPage(10)
            .fields([
                nga.field('created_at', 'date')
                    .label('Posted'),
                nga.field('body', 'wysiwyg')
                    .label('Comment')
                    .stripTags(true)
                    .map(truncate)
                    .isDetailLink(true),
                nga.field('post_id', 'reference')
                    .label('Post')
                    .map(truncate)
                    .targetEntity(post)
                    .targetField(nga.field('title').map(truncate))
            ])
            .sortField('created_at')
            .sortDir('DESC')
            .order(2)
        )
    );
    /*将所有配置渲染*/
    nga.configure(admin);
}]);
myApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            // custom pagination params
            if (params._page) {
                params._start = (params._page - 1) * params._perPage;
                params._end = params._page * params._perPage;
            }
            delete params._page;
            delete params._perPage;
            // custom sort params
            if (params._sortField) {
                params._sort = params._sortField;
                params._order = params._sortDir;
                delete params._sortField;
                delete params._sortDir;
            }
            // custom filters
            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);
//Adding a Route
myApp.config(function ($stateProvider) {
    $stateProvider.state('send-post', {
        parent: 'main',
        url: '/sendPost/:id',
        params: { id: null },
        controller: sendPostController,
        controllerAs: 'controller',
        template: sendPostControllerTemplate
    });
});
function truncate(value) {
    if (!value) return '';
    return value.length > 50 ? value.substr(0, 50) + '...' : value;
}
function sendPostController($stateParams, notification) {
    this.postId = $stateParams.id;
    // notification is the service used to display notifications on the top of the screen
    this.notification = notification;
};
sendPostController.inject = ['$stateParams', 'notification'];
sendPostController.prototype.sendEmail = function() {
    this.notification.log('Email successfully sent to ' + this.email);
};
//Adding a controllerTemplate
var sendPostControllerTemplate =
    '<div class="row"><div class="col-lg-12">' +
        '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
        '<div class="page-header">' +
            '<h1>Send post #{{ controller.postId }} by email</h1>' +
        '</div>' +
    '</div></div>' +
    '<div class="row">' +
        '<div class="col-lg-5"><input type="text" size="10" ng-model="controller.email" class="form-control" placeholder="name@example.com"/></div>' +
        '<div class="col-lg-5"><a class="btn btn-default" ng-click="controller.sendEmail()">Send</a></div>' +
    '</div>';
myApp.directive('sendEmail', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: { post: '&' },
        link: function (scope) {
            scope.send = function () {
                $location.path('/sendPost/' + scope.post().values.id);
            };
        },
        template: '<a class="btn btn-default" ng-click="send()">Send post by email</a>'
    };
}]);
//require the router.js
//require('js/router.js');