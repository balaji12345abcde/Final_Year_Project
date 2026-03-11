import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "legal_ai.settings")
django.setup()

from nlp_engine.models import ActSection

acts_data = [

# IPC Sections
("IPC","120B","Criminal conspiracy"),
("IPC","121","Waging war against the Government of India"),
("IPC","141","Unlawful assembly"),
("IPC","143","Punishment for unlawful assembly"),
("IPC","146","Rioting"),
("IPC","153A","Promoting enmity between groups"),
("IPC","186","Obstructing public servant in discharge of public functions"),
("IPC","191","Giving false evidence"),
("IPC","193","Punishment for false evidence"),
("IPC","199","False statement made in declaration"),
("IPC","209","False claim in court"),
("IPC","292","Sale of obscene books"),
("IPC","295","Injuring or defiling place of worship"),
("IPC","296","Disturbing religious assembly"),
("IPC","297","Trespassing on burial places"),
("IPC","298","Uttering words with deliberate intent to wound religious feelings"),
("IPC","299","Culpable homicide"),
("IPC","300","Murder"),
("IPC","302","Punishment for murder"),
("IPC","304","Culpable homicide not amounting to murder"),
("IPC","304A","Causing death by negligence"),
("IPC","307","Attempt to murder"),
("IPC","309","Attempt to commit suicide"),
("IPC","323","Punishment for voluntarily causing hurt"),
("IPC","324","Voluntarily causing hurt by dangerous weapons"),
("IPC","326","Grievous hurt by dangerous weapons"),
("IPC","339","Wrongful restraint"),
("IPC","340","Wrongful confinement"),
("IPC","341","Punishment for wrongful restraint"),
("IPC","342","Punishment for wrongful confinement"),
("IPC","351","Assault"),
("IPC","352","Punishment for assault"),
("IPC","354","Assault on woman with intent to outrage modesty"),
("IPC","363","Kidnapping"),
("IPC","366","Kidnapping woman to compel marriage"),
("IPC","375","Rape"),
("IPC","376","Punishment for rape"),
("IPC","378","Theft"),
("IPC","379","Punishment for theft"),
("IPC","383","Extortion"),
("IPC","384","Punishment for extortion"),
("IPC","390","Robbery"),
("IPC","392","Punishment for robbery"),
("IPC","395","Dacoity"),
("IPC","403","Dishonest misappropriation of property"),
("IPC","405","Criminal breach of trust"),
("IPC","406","Punishment for criminal breach of trust"),
("IPC","409","Criminal breach of trust by public servant"),
("IPC","415","Cheating"),
("IPC","417","Punishment for cheating"),
("IPC","418","Cheating with knowledge that wrongful loss may ensue"),
("IPC","420","Cheating and dishonestly inducing delivery of property"),
("IPC","463","Forgery"),
("IPC","464","Making a false document"),
("IPC","465","Punishment for forgery"),
("IPC","467","Forgery of valuable security"),
("IPC","468","Forgery for cheating"),
("IPC","469","Forgery harming reputation"),
("IPC","471","Using forged document as genuine"),
("IPC","499","Defamation"),
("IPC","500","Punishment for defamation"),

# IT Act
("IT Act","43","Damage to computer systems"),
("IT Act","65","Tampering with computer source documents"),
("IT Act","66","Computer related offences"),
("IT Act","66B","Receiving stolen computer resource"),
("IT Act","66C","Identity theft"),
("IT Act","66D","Cheating by personation using computer"),
("IT Act","66E","Violation of privacy"),
("IT Act","66F","Cyber terrorism"),
("IT Act","67","Publishing obscene content online"),
("IT Act","67A","Publishing sexually explicit content"),
("IT Act","67B","Child pornography"),

# Contract Act
("Indian Contract Act","10","What agreements are contracts"),
("Indian Contract Act","11","Who are competent to contract"),
("Indian Contract Act","13","Consent defined"),
("Indian Contract Act","14","Free consent"),
("Indian Contract Act","23","What considerations are lawful"),
("Indian Contract Act","37","Obligation of parties to contracts"),
("Indian Contract Act","39","Effect of refusal of party to perform promise"),
("Indian Contract Act","73","Compensation for breach of contract"),
("Indian Contract Act","74","Compensation where penalty stipulated"),

]

for act, section, description in acts_data:

    ActSection.objects.create(
        act_name=act,
        section_number=section,
        description=description,
        keywords=description
    )

print("✅ Legal Acts Dataset Inserted Successfully")