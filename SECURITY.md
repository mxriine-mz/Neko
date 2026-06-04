# Politique de sécurité

## Versions prises en charge

Seule la dernière version stable du projet (branche `main`) bénéficie de
correctifs de sécurité. La version 1 (`v1.0.0`) n'est plus maintenue.

| Version | Prise en charge |
| ------- | --------------- |
| 2.x     | Oui             |
| 1.x     | Non             |

## Signaler une vulnérabilité

Les vulnérabilités ne doivent **pas** être signalées via une issue publique.

Merci de les transmettre en privé à **mazou.marine@gmail.com** en précisant :

- une description du problème et de son impact ;
- les étapes permettant de le reproduire ;
- la version ou le commit concerné ;
- toute piste de correction éventuelle.

Un accusé de réception est envoyé sous quelques jours. Le correctif est publié
dès que possible, et la divulgation reste coordonnée avec la personne ayant
effectué le signalement.

## Bonnes pratiques

- Ne jamais versionner le fichier `.env` ni aucun secret (token Discord,
  identifiants de base de données, clés OAuth).
- Restreindre l'accès réseau à PostgreSQL.
- Maintenir les dépendances à jour.
