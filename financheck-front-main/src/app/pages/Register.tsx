import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Mail,
  Lock,
  User,
  UserPlus,
  Calendar
} from 'lucide-react';
import api from '../../services/api';

const BRAZILIAN_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO'
];

const CITIES_BY_STATE: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Sorocaba'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora'],
  BA: ['Salvador', 'Feira de Santana'],
  PR: ['Curitiba', 'Londrina']
};

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
  city: string;
  state: string;
  controleFamiliar: boolean;
};

export function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    city: '',
    state: '',
    controleFamiliar: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return 0;

    const today = new Date();
    const birth = new Date(birthdate);

    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (
        today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate()
      )
    ) {
      age--;
    }

    return age;
  };

  const validateField = (
    name: keyof FormData,
    value: string | boolean
  ): string => {
    if (name === 'controleFamiliar') return '';
    if (typeof value !== 'string') return '';

    switch (name) {
      case 'name':
        if (!value.trim()) return 'Nome obrigatório';
        if (value.length < 3) return 'Mínimo 3 caracteres';
        return '';

      case 'email':
        if (!value.trim()) return 'Email obrigatório';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Email inválido';
        return '';

      case 'password':
        if (!value) return 'Senha obrigatória';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return '';

      case 'confirmPassword':
        if (value !== formData.password)
          return 'As senhas não coincidem';
        return '';

      case 'birthdate': {
        if (!value) return 'Data obrigatória';

        const age = calculateAge(value);

        if (age < 18) return 'Necessário ter +18';
        if (age > 120) return 'Data inválida';

        return '';
      }

      case 'city':
        return value ? '' : 'Cidade obrigatória';

      case 'state':
        return value ? '' : 'Estado obrigatório';

      default:
        return '';
    }
  };

  const handleChange = (
    name: keyof FormData,
    value: string | boolean
  ) => {
    const updated = {
      ...formData,
      [name]: value
    };

    if (name === 'state') updated.city = '';

    setFormData(updated);

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
      const error = validateField(key, formData[key]);

      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post('/usuarios/cadastro', {
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        controleFamiliar: formData.controleFamiliar
      });

      alert('Conta criada com sucesso');
      navigate('/login');

    } catch (error) {
      console.error(error);
      alert('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const availableCities =
    CITIES_BY_STATE[formData.state] || [];

  const hasErrors =
    Object.values(errors).some(Boolean);

  const isFormComplete =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.birthdate &&
    formData.city &&
    formData.state;

  const isDisabled =
    hasErrors ||
    !isFormComplete ||
    loading;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        fontFamily: 'Inter, sans-serif',
        background:
          'linear-gradient(160deg,#E5EEFB 0%,#F5F9FF 30%,#FAFCFF 60%,#E8F1FC 100%)'
      }}
    >
      <div className="w-full max-w-[560px]">
        <div className="text-center mb-8">
          <h1 className="text-[#2E4A7C] text-3xl font-semibold">
            Criar conta
          </h1>

          <p className="text-[#7BA8F5] mt-2">
            Comece a gerenciar suas finanças
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-3xl rounded-[32px] p-10 border-2 border-white/60 shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {[
              { name:'name',label:'Nome',icon:User,type:'text'},
              { name:'email',label:'Email',icon:Mail,type:'email'},
              { name:'birthdate',label:'Nascimento',icon:Calendar,type:'date'},
              { name:'password',label:'Senha',icon:Lock,type:'password'},
              { name:'confirmPassword',label:'Confirmar senha',icon:Lock,type:'password'}
            ].map(field => {
              const Icon = field.icon;

              return (
                <div key={field.name}>
                  <label className="block mb-2 text-sm font-medium text-[#2E4A7C]">
                    {field.label}
                  </label>

                  <div className="relative">
                    <Icon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]"
                    />

                    <input
                      type={field.type}
                      value={formData[field.name as keyof FormData]}
                      onChange={e =>
                        handleChange(
                          field.name as keyof FormData,
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleBlur(
                          field.name as keyof FormData
                        )
                      }
                      className="w-full pl-12 pr-5 py-3.5 rounded-[18px] border-2 border-white/70 bg-white/60 focus:border-[#7BA8F5] outline-none"
                    />
                  </div>

                  {errors[field.name] &&
                    touched[field.name] && (
                      <p className="text-sm text-red-400 mt-2">
                        {errors[field.name]}
                      </p>
                    )}
                </div>
              );
            })}

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.state}
                onChange={e =>
                  handleChange('state', e.target.value)
                }
                className="rounded-[18px] p-4 border-2 border-white/70"
              >
                <option value="">Estado</option>

                {BRAZILIAN_STATES.map(state => (
                  <option key={state}>{state}</option>
                ))}
              </select>

              <select
                value={formData.city}
                onChange={e =>
                  handleChange('city', e.target.value)
                }
                disabled={!formData.state}
                className="rounded-[18px] p-4 border-2 border-white/70"
              >
                <option value="">Cidade</option>

                {availableCities.map(city => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-[18px] p-4 border-2 border-white/70 bg-white/60 text-[#2E4A7C] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.controleFamiliar}
                onChange={e =>
                  handleChange('controleFamiliar', e.target.checked)
                }
                className="h-5 w-5 accent-[#5B8FE8]"
              />
              <span className="text-sm font-medium">
                Controle familiar
              </span>
            </label>

            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-semibold transition ${
                isDisabled
                  ? 'bg-[#7BA8F5]/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] hover:scale-[1.02]'
              }`}
            >
              <UserPlus size={20} />
              {loading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center mt-6 text-[#7BA8F5]">
            Já tem conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#4A7BD8]"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
