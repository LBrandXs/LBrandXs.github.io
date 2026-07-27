import { useForm, ValidationError } from '@formspree/react';

// Tu formulario real de Formspree — https://formspree.io/f/mwvgaboe
const FORMSPREE_ID = 'mwvgaboe';

export default function ContactForm() {
  const [state, handleSubmit] = useForm(FORMSPREE_ID);

  if (state.succeeded) {
    return (
      <p className="form-status form-status--ok">
        Listo, te leo pronto — gracias por escribir.
      </p>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="cf-name">Nombre</label>
        <input id="cf-name" name="name" type="text" required placeholder="Tu nombre" />
      </div>

      <div className="form-field">
        <label htmlFor="cf-email">Tu correo</label>
        <input id="cf-email" name="email" type="email" required placeholder="Para poder responderte" />
        <ValidationError
          prefix="Correo"
          field="email"
          errors={state.errors}
          className="form-status form-status--error"
        />
      </div>

      <div className="form-field">
        <label htmlFor="cf-message">Mensaje</label>
        <textarea id="cf-message" name="message" rows={4} required placeholder="Contame en qué puedo ayudarte" />
        <ValidationError
          prefix="Mensaje"
          field="message"
          errors={state.errors}
          className="form-status form-status--error"
        />
      </div>

      <button className="contact-submit" type="submit" disabled={state.submitting}>
        {state.submitting ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      {/* Errores generales del envío (no ligados a un campo puntual) */}
      <ValidationError
        errors={state.errors}
        className="form-status form-status--error"
      />
      {state.errors && (
        <p className="form-status form-status--error">
          Si el problema persiste, escribime directo a{' '}
          <a href="mailto:xsbrando@gmail.com">xsbrando@gmail.com</a>.
        </p>
      )}
    </form>
  );
}
