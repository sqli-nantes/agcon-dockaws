

######### Doc
http://docs.aws.amazon.com/cli/latest/userguide/tutorial-ec2-ubuntu.html#configure-cli-launch-ec2
#Limit du nombre d'instance par zone, only one for now
http://aws.amazon.com/fr/ec2/faqs/#How_many_instances_can_I_run_in_Amazon_EC2

######################### INSTALL LOCAL TOOLS (debian) ######################
#As root
sudo -i
#Install Docker
curl -sSL https://get.docker.com/ | sh
#Install Docker machine
curl -L https://github.com/docker/machine/releases/download/v0.6.0/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && chmod +x /usr/local/bin/docker-machine
#Install Docker compose
curl -L https://github.com/docker/compose/releases/download/1.6.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
#Install aws cli
apt-get install awscli
#get back to standard user
exit

######################### Configure aws cli et set les varaibles dans ~/.aws/credentials ######################
aws configure
AWS Access Key ID [None]: XXXXXXXXXXXXXXXXXx
AWS Secret Access Key [None]: XXXXXXXXXXXXXXXXXXXXXx
Default region name [None]: us-east-1
Default output format [None]: 

######################### Initiate aws project   ######################
export AWS_PROJECT=testv10

##### Create the security group pour ouvrir certain port du docker host. Au moins SSH 22 + Docker command 2376
aws ec2 create-security-group --group-name docksg$AWS_PROJECT --description dock-security-group-$AWS_PROJECT
aws ec2 authorize-security-group-ingress --group-name docksg$AWS_PROJECT --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name docksg$AWS_PROJECT --protocol tcp --port 2376 --cidr 0.0.0.0/0

######################### Create the docker host server basé sur amazon Linux AMI et t2.micro pour profiter les 750h gratuit par mois   ######################
docker-machine create --driver amazonec2 \
--amazonec2-region us-east-1 \
--amazonec2-zone c \
--amazonec2-security-group docksg$AWS_PROJECT \
--amazonec2-tags project:$AWS_PROJECT dockinstance$AWS_PROJECT

#   --engine-env [--engine-env option --engine-env option] Specify environment variables to set in the engine


#Recuperation de l'instance ID
export AWS_ID=`aws ec2 describe-instances --filters "Name=tag-value,Values=dockinstance$AWS_PROJECT" --output text --query 'Reservations[0].Instances[0].InstanceId'`
echo $AWS_ID

#### definit le variables d'env pour definir ce docker host par default
#### a partir de ce moment les commandes docker et docker-compose vont s'executer sur le docker host créer chez aws
eval $(docker-machine env dockinstance$AWS_PROJECT)
################ docker machine ip
docker-machine ip dockinstance$AWS_PROJECT
################ docker machine ssh on peux aussi stop/start notre docker host
docker-machine ssh dockinstance$AWS_PROJECT
# On a normalement pas de raison de se connecter directement en ssh au docker host, tous passe par des commandes docker à distance

########################Build l'image docker (le dockerfile local) sur le docker host distant
docker build -t hello .
########################On démarre nos images (docker-compose.yml) sur le docker host distant
docker-compose up

##Allow extra port (ici le port 80 doit être ouvert pour acceder au service)
aws ec2 authorize-security-group-ingress --group-name docksg$AWS_PROJECT --protocol tcp --port 80 --cidr 0.0.0.0/0

##Test
curl http://$(docker-machine ip dockinstance$AWS_PROJECT)/hello/$AWS_PROJECT

###########################" Clean projet
docker-machine rm dockinstance$AWS_PROJECT
aws ec2 delete-security-group --group-name docksg$AWS_PROJECT
## A TESTER docker-machine rm dockinstance$AWS_PROJECT --amazonec2-security-group docksg$AWS_PROJECT



