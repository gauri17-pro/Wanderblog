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
eksctl create cluster -f eks-config.yml
```

- Using Terraform 

You can refer the video: https://youtu.be/wY8VFIAz_Og?si=1USqt2bME8_Gh9jt

You can modify the EKS configuration as per the requirement.

c. Create IAM Policy

```
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.13.3/docs/install/iam_policy.json
```

```
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json
```

d. Create an IAM-Backed Kubernetes Service Account

```
eksctl create iamserviceaccount \
  --cluster=wanderblog-eks-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::<Account-id>:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --region ap-south-1 \
  --approve
```

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
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks
```

```
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=wanderblog-eks-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --version 1.13.0
```

#### 6. Install the CSI Addon 

```
kubectl apply -k "github.com/kubernetes-sigs/aws-ebs-csi-driver/deploy/kubernetes/overlays/stable/?ref=release-1.44"
```

#### 7. Create the sealed files 

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

#### 8. You need a domain to host your website on using Ingress

#### 9. Create a Hosted Zone for your host on Route53 

You just provide the custom domain that you got from Hostinger or any other relevant website

#### 10. And for SSL certificate you can use ACM certificate

a. Click on Request Certificate 

b. Enter the Fully Qualified Domain Name and click on Request keeping the rest as it is.

c. Click on Create a Route53 Record

d. This will create a CNAME record on your Hosted Zone.

#### 11. Verify the Certificate 

a. Go to your domain hosting website 

b. Go to your Domain -> DNS/Nameservers -> Add Record -> CNAME 

c. This will verify the request and show the status as Success after some time

#### 12. Add the certificate to the annotations section of Ingress

```
alb.ingress.kubernetes.io/ssl-redirect: '443'
alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:ap-south-1:829058667760:certificate/a011b35b-b2bf-435e-9cca-a1e7827031a3
```

#### 13. Apply all the manifest files.

a. Execute the command

```
kubectl apply -f kubernetes-manifests/*
```

#### 14. Add the A record in Route53

a. Go to the Hosted Zone on Route53 
b. No need to add the Record name
c. Enable Alias
d. Select the load balancer

#### 15. Try accessing the website using Domain name











