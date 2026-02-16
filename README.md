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





