# Wanderblog

![alt text](image.png)

This application is based on a three tier architecture which includes frontend, backend and database to operate.

1. Frontend: React based running at port 80
2. Backend: NodeJS based running at port 5000
3. MongoDB database: Running at port 27017 

## Steps to be followed for Deployment on Kubernetes

#### 1. Setup an EKS Cluster on AWS 

- This can be done either manually or using CLI or through IaC (Terraform)

- Using CLI we can follow the steps below:

a. Install eksctl on the AWS cloud shell

```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

b. Run the command below to setup an EKS Cluster using eksctl

```
eksctl create cluster --name eks-cluster --version 1.35 --region ap-south-1 --node-type t2.medium  --zones ap-south-1a,ap-south-1b
```

- Using Terraform 

You can refer the video: https://youtu.be/wY8VFIAz_Og?si=1USqt2bME8_Gh9jt

You can modify the instance types of node-groups as per the requirement.

#### 2. Install helm

a. Execute the commands below:

```
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4
chmod 700 get_helm.sh
./get_helm.sh
```

#### 3. Install Kubeseal for sealing secrets 

```
KUBESEAL_VERSION='0.35.0' 
curl -OL "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION:?}/kubeseal-${KUBESEAL_VERSION:?}-linux-amd64.tar.gz"
tar -xvzf kubeseal-${KUBESEAL_VERSION:?}-linux-amd64.tar.gz kubeseal
sudo install -m 755 kubeseal /usr/local/bin/kubeseal
```

#### 4. Install Sealed-secrets controller 

```
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm repo update sealed-secrets
helm install sealed-secrets-controller sealed-secrets/sealed-secrets --namespace kube-system
```

#### 5. Install AWS Load Balancer Controller 

```
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=eks-cluster
```

#### 6. Create the sealed files 

a. Create sealed file for Mongo Secrets

```
kubectl create secret generic mongo-secrets \
  --from-literal=MONGO_INITDB_ROOT_USERNAME=admin --from-literal=MONGO_INITDB_ROOT_PASSWORD=mongodb123 \
  --dry-run=client -o yaml | \
kubeseal \
  --controller-name sealed-secrets-controller \
  --controller-namespace kube-system \
  -o yaml | tee mongo-sealedsecret.yml
```

b. Create sealed files for Backend URL

```
kubectl create secret generic backend-secrets \
  --from-literal=MONGO_URI="mongodb://admin:mongodb123@mongo-service:27017/mydb?authSource=admin" \
  --dry-run=client -o yaml | \
kubeseal \
  --controller-name sealed-secrets-controller \
  --controller-namespace kube-system \
  -o yaml | tee backend-sealedsecret.yml
```






