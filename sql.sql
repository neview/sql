SELECT *FROM user JOIN id_card ON user.id = id_card.user_id;

SELECT user.id,name,id_card.id as card_id,card_name FROM user JOIN id_card ON user.id = id_card.user_id;

SELECT user.id,name,id_card.id as card_id,card_name FROM user RIGHT JOIN id_card ON user.id = id_card.user_id;

SELECT user.id,name,id_card.id as card_id,card_name FROM user LEFT JOIN id_card ON user.id = id_card.user_id;