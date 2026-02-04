import { useState } from 'react'
import './AdForm.css'
import { validateMusicId } from '../../services/musicService'
import { submitAd } from '../../services/adService'

export default function AdForm() {

  const [form, setForm] = useState({
    campaignName: '',
    objective: '',
    adText: '',
    cta: '',
    music: {
      mode: 'none',
      musicId: ''
    }
  })

  const [errors, setErrors] = useState({})

  // Music validation state
  const [musicStatus, setMusicStatus] = useState('idle') // idle | loading | valid | error
  const [musicError, setMusicError] = useState('')

  // Submission state
  const [globalError, setGlobalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* ------------------ helpers ------------------ */

  const updateField = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateMusic = (key, value) => {
    setForm(prev => ({
      ...prev,
      music: {
        ...prev.music,
        [key]: value
      }
    }))

    // reset music validation on change
    setMusicStatus('idle')
    setMusicError('')
  }

  /* ------------------ validation ------------------ */

  const validate = () => {
    const newErrors = {}

    if (!form.campaignName || form.campaignName.length < 3) {
      newErrors.campaignName = 'Campaign name must be at least 3 characters'
    }

    if (!form.objective) {
      newErrors.objective = 'Objective is required'
    }

    if (!form.adText) {
      newErrors.adText = 'Ad text is required'
    } else if (form.adText.length > 100) {
      newErrors.adText = 'Ad text must be 100 characters or less'
    }

    if (!form.cta) {
      newErrors.cta = 'CTA is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ------------------ music validation ------------------ */

  const handleValidateMusic = async () => {
    setMusicStatus('loading')
    setMusicError('')

    try {
      await validateMusicId(form.music.musicId)
      setMusicStatus('valid')
    } catch (err) {
      setMusicStatus('error')
      setMusicError(err.message || 'Invalid music ID')
    }
  }

  /* ------------------ submit ------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')

    const basicValid = validate()
    if (!basicValid) return

    // Music rules (assignment requirement)
    if (form.objective === 'Conversions') {
      if (form.music.mode === 'none') {
        setMusicStatus('error')
        setMusicError('Music is required for Conversions objective')
        return
      }

      if (musicStatus !== 'valid') {
        setMusicStatus('error')
        setMusicError('Please validate music before submitting')
        return
      }
    }

    setIsSubmitting(true)

    try {
      await submitAd({
        campaignName: form.campaignName,
        objective: form.objective,
        adText: form.adText,
        musicId: form.music.mode === 'none' ? null : form.music.musicId
      })

      alert('Ad submitted successfully!')
    } catch (err) {
      // System-level errors → global banner
      if (err.type === 'geo') {
        setGlobalError('Service not available in your region.')
      } else if (err.type === 'auth') {
        setGlobalError('Session expired. Please reconnect your TikTok account.')
      } else if (err.type === 'permission') {
        setGlobalError('Missing permission to create ads.')
      } else {
        setGlobalError(err.message || 'Something went wrong.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ------------------ UI ------------------ */

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Ad</h2>

      {globalError && (
        <div className="global-error">{globalError}</div>
      )}

      {/* Campaign Name */}
      <div>
        <label>Campaign Name</label><br />
        <input
          type="text"
          value={form.campaignName}
          onChange={e => updateField('campaignName', e.target.value)}
        />
        {errors.campaignName && <div className="error">{errors.campaignName}</div>}
      </div>

      <br />

      {/* Objective */}
      <div>
        <label>Objective</label><br />
        <select
          value={form.objective}
          onChange={e => updateField('objective', e.target.value)}
        >
          <option value="">Select objective</option>
          <option value="Traffic">Traffic</option>
          <option value="Conversions">Conversions</option>
        </select>
        {errors.objective && <div className="error">{errors.objective}</div>}
      </div>

      <br />

      {/* Ad Text */}
      <div>
        <label>Ad Text</label><br />
        <textarea
          value={form.adText}
          onChange={e => updateField('adText', e.target.value)}
        />
        {errors.adText && <div className="error">{errors.adText}</div>}
      </div>

      <br />

      {/* CTA */}
      <div>
        <label>CTA</label><br />
        <select
          value={form.cta}
          onChange={e => updateField('cta', e.target.value)}
        >
          <option value="">Select CTA</option>
          <option value="Shop Now">Shop Now</option>
          <option value="Sign Up">Sign Up</option>
          <option value="Learn More">Learn More</option>
        </select>
        {errors.cta && <div className="error">{errors.cta}</div>}
      </div>

      <br />

      <hr />
      <h3>Music Selection</h3>

      {/* Option A */}
      <div>
        <label>
          <input
            type="radio"
            checked={form.music.mode === 'existing'}
            onChange={() => updateMusic('mode', 'existing')}
          />
          Use Existing Music ID
        </label>

        {form.music.mode === 'existing' && (
          <div>
            <input
              type="text"
              placeholder="Enter Music ID"
              value={form.music.musicId}
              onChange={e => updateMusic('musicId', e.target.value)}
            />

            <button
              type="button"
              onClick={handleValidateMusic}
              disabled={!form.music.musicId || musicStatus === 'loading'}
            >
              {musicStatus === 'loading' ? 'Validating...' : 'Validate'}
            </button>

            {musicStatus === 'valid' && <div className="success">Music validated</div>}
            {musicStatus === 'error' && <div className="error">{musicError}</div>}
          </div>
        )}
      </div>

      <br />

      {/* Option B */}
      <div>
        <label>
          <input
            type="radio"
            checked={form.music.mode === 'upload'}
            onChange={() => updateMusic('mode', 'upload')}
          />
          Upload / Custom Music
        </label>

        {form.music.mode === 'upload' && (
          <div>
            <button
              type="button"
              onClick={async () => {
                const mockId = 'music_' + Date.now()
                updateMusic('musicId', mockId)

                setMusicStatus('loading')
                setMusicError('')

                try {
                  await validateMusicId(mockId)
                  setMusicStatus('valid')
                } catch (err) {
                  setMusicStatus('error')
                  setMusicError(err.message || 'Invalid music')
                }
              }}
            >
              Simulate Upload
            </button>

            {musicStatus === 'valid' && <div className="success">Music uploaded & validated</div>}
            {musicStatus === 'error' && <div className="error">{musicError}</div>}
          </div>
        )}
      </div>

      <br />

      {/* Option C */}
      <div>
        <label>
          <input
            type="radio"
            checked={form.music.mode === 'none'}
            disabled={form.objective === 'Conversions'}
            onChange={() => updateMusic('mode', 'none')}
          />
          No Music
        </label>

        {form.objective === 'Conversions' && (
          <div className="hint">Music is required for Conversions objective</div>
        )}
      </div>

      <br />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Ad'}
      </button>
    </form>
  )
}
