from nlp_engine.models import ActSection

acts_data = [
("IPC","406","Criminal breach of trust"),
("IPC","409","Criminal breach of trust by public servant"),
("IPC","415","Cheating definition"),
("IPC","420","Cheating and dishonestly inducing delivery of property"),
("IPC","463","Forgery"),
("IPC","464","Making a false document"),
("IPC","468","Forgery for purpose of cheating"),
("IPC","471","Using forged document as genuine"),
("IPC","503","Criminal intimidation"),
("IPC","506","Punishment for criminal intimidation"),
]

# Auto generate many variations
for i in range(1,101):
    act = acts_data[i % len(acts_data)]
    
    ActSection.objects.create(
        act_name=act[0],
        section_number=str(int(act[1]) + i),
        description=f"{act[2]} - Case reference example number {i}"
    )

print("100 Acts inserted successfully")
