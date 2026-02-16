# Wanderblog

![alt text](image.png)

This application is based on a three tier architecture which includes frontend, backend and database to operate.

1. Frontend: React based running at port 80
2. Backend: NodeJS based running at port 5000
3. MongoDB database: Running at port 27017 

## Steps to be followed for Deployment on Kubernetes

1. Setup an EKS Cluster on AWS 

- This can be done either manually or using CLI or through IaC (Terraform)

- Using CLI we can follow the steps below:

1. Install eksctl on the AWS cloud shell

```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```



