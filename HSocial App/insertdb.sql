
-- passwrod 123456
INSERT INTO `user`  (	user_name		    ,       `address`                      ,           date_of_birth        ,              gender         ,    `role`         ,  phone_number         ,   education                           ,           `email`                       ,						`password`								  )
VALUES 				(	'Huy Long Diệt'		,        'Ning Giang Hai Duong'        ,           '2001-09-29'         ,              'MAlE'         ,    'ADMIN'        ,  '0376339553'         , 'Đại học công nghiệp Hà Nội'          ,       'anhhuy2909@gmail.com'	        ,   '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi'),
					(	'quanganh'		    ,        'Lào Cai'                     ,           '2001-06-25'         ,              'FEMALE'       ,    'USER'         ,  '0986414635'         ,     ''                                ,       'quanganh@gmail.com'	            ,	'$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi'),
                    (	'huylongdiet'   	,        'Ning Giang - Hải Dương'      ,           '2001-09-29'         ,              'MALE'         ,    'ADMIN'        ,  '0376339555'         , ''                                    ,       'anhhuy290901@gmail.com'	        ,	'$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi'),
                    (	'cocoduongqua'	    ,        'Nam Định'                    ,           '1994-03-28'         ,              'MALE'         ,    'USER'         ,  '0322415456'         , ''                                    ,       'cocoduongqua@gmail.com'          ,	'$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi');

                    
-- insert data table post
INSERT INTO `post`  (     user_id       ,           content                         ,           page_id         )
VALUES              (      2            ,            'anh nhớ em'                   ,               1           ), 
                    (      2            ,            'anh vẫn còn yêu em'           ,               1           ),
                    (      1            ,            'Đời là buồn'                  ,            DEFAULT        ),
                    (      3            ,            'Phải cố gắng'                 ,               2           ),
                    (      4            ,            'Không được nản'               ,               2           );
                
                                
-- insert data table comment
INSERT INTO `comment`           (       user_id         ,           post_id         ,           content             )
VALUES                          (       1               ,           1               ,              'xinh quá!'      ),
                                (       1               ,           1               ,              'hay quá bà'     ),
                                (       2               ,           1               ,              'xinh quá! nè'   ),
                                (       3               ,           2               ,              'xinh quá!'      );

-- insert data table like
INSERT INTO `like`              (       user_id         ,           post_id         )
VALUES                          (       1               ,               1           ),
                                (       1               ,               2           ), 
                                (       2               ,               3           );


-- insert data table message
INSERT INTO `message`           (         sender_id     ,               receiver_id         ,               content             )
VALUES                          (           1           ,                   2               ,                'anh yeu em'       ),
                                (           1           ,                   2               ,                'anh nhơ em'       ),
                                (           1           ,                   3               ,                'toi yeu em'       ),
                                (           2           ,                   1               ,                'anh cung yeu em'  ),
                                (           1           ,                   2               ,                'anh yeu em'       ),
                                (           3           ,                   2               ,                'anh yeu em'       ),
                                (           4           ,                   1               ,                'anh yeu em'       ),
                                (           1           ,                   2               ,                'anh yeu em'       );
                                                        
                                