Docker / k8s
================  
  
#### 양민석 김낙현 김민수 임경섭

---

### 진행상황

- 이전까지 했던 것들
  + Docker 이미지 필드 (Dockerfile)
  + Docker-compose
  + Kubernetes (k8s)

- 이번 스터디
  + Deployment (with k8s)
  + Service (with k8s)
  + 함정

---
### Kubernetes

#### Pod

- **pod** : k8s 클러스터에서 실행되는 프로세스

- **pod**들은 클러스터 안에서 고유한 IP를 가진다.

- **Deployment**를 통해 **pod**을 생성하고 실행할 수 있다.

- **Service**를 통해 클러스터 밖에서 **pod**의 IP주소에 접근할 수 있도록 한다.

---
### Deployment

#### Imperative

생성한 이미지의 Deployment를 생성해 실행한다.
port나 env 등의 환경을 지정할 수 있다.
```bash
$ kubectl run <deployment-name> \
	--image=<image-name> \
	--port=<port-number>
```

<br>
Deployment 조회
```bash
$ kubectl get deployments
NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kubernetes-django   1         1         1            1           20h
```

Deployment 삭제
```bash
$ kubectl delete deployment/<deployment-name>
```
---
### Deployment
#### Declarative
`deployment.yaml`에 Deployment에 필요한 설정을 지정한다.

```ml
apiVersion: apps/v1beta2
kind: Deployment
metadata:
  name: <deployment_name>
  labels:
    <deployment_label_key>: <deployment_label_value>
spec:
  replicas: <number_of_replicas>
    spec:
      containers:
        - name: <pod_name>
          image: <pod_image>
          ports:
            - containerPort: <port_number>
          env:
            - name: <env_name>
              value: <env_value>
            - name: <env_name2>
              value: <env_value2> 
```
---
### Deployment
#### Declarative (cont.)
설정 파일을 적용하여 Deployment를 생성한다.
```bash
$ kubectl apply -f deployment.yaml
deployment "<deployment-name>" created
```
<br>
- 조회, 삭제 방법은 Imperative와 동일하다.


---
### Service

#### Imperative
Expose를 통해 Deployment의 Port를 열고,  
Minikube를 통해 `<minikube_ip>:<nodePort>` URL로 접근할 수 있게된다.
```bash
$ kubectl expose deployment <deployment-name> --type=NodePort
$ minikube service <service-name>
```

<br>
Service 조회
```bash
$ kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
django       NodePort    10.111.73.57   <none>        8000:30098/TCP   16s
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP          4d
```

Service 삭제
```bash
$ kubectl delete svc/<service-name>
```
---
### Service
#### Declarative
`service.yaml`에 Service에 필요한 설정을 지정한다.
```ml
apiVersion: v1
kind: Service
metadata:
  name: kubernetes-django-service
spec:
  selector:
    <pod_key>: <pod_value>
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: NodePort
```

설정 파일을 적용하여 Service를 생성한다.
```bash
$ kubectl apply -f service.yaml
service "<service-name>" created
```

- 확인, 삭제 방법은 Imperative와 동일하다.
---
### 함정

#### 실습 실패

- 참조한 블로그에서 제공하는 Image에 문제가 있는 것으로 추정

- 이전 스터디에서 생성했던 django 이미지와 postgre 이미지를 Deploy하는 것까지 성공

- 그러나...

- 서비스는 작동이 안됨... 관련 정보를 더 찾아봐야 할 것 같읍니다.

---

### 참조

- [Minikube + Django (실습실패)](https://medium.com/@markgituma/kubernetes-local-to-production-with-django-2-docker-and-minikube-ba843d858817)

- [Deployment(k8s 공식 문서)](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

- [Service(k8s 공식 문서)](https://kubernetes.io/docs/concepts/services-networking/service/)
